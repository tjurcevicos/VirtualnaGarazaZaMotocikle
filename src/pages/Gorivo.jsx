import { LinijskiGraf } from '../components/StatistickiGrafovi'
import { useState } from 'react'
import {
  calculateFuelStatistics,
  calculateVehicleFuelStatistics,
  calculatePricePerLiter,
} from '../utils/fuelCalculations'

function Gorivo({
  vehicles,
  fuelRecords,
  onAddFuelRecord,
  onDeleteFuelRecord,
  onUpdateFuelRecord,
}) {
  const [showForm, setShowForm] = useState(false)
  const [statisticsVehicleId, setStatisticsVehicleId] = useState('')
  const [filterVehicleId, setFilterVehicleId] = useState('')
  const [editingRecordId, setEditingRecordId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: '',
    liters: '',
    price: '',
    unitPrice: '',
    station: '',
    fullTank: false,
    mileage: '',
  })

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setError('')
  }

  function resetForm() {
    setFormData({
      vehicleId: '',
      date: '',
      liters: '',
      price: '',
      unitPrice: '',
      station: '',
      fullTank: false,
      mileage: '',
    })

    setEditingRecordId(null)
    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const liters = Number(formData.liters)
    const unitPrice = Number(formData.unitPrice)
    const price = Math.round(Number(formData.liters) * unitPrice * 100) / 100
    const mileage = Number(formData.mileage)

    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.liters ||
      !formData.unitPrice ||
      formData.mileage === ''
    ) {
      setError('Molimo ispuni sva polja.')
      return
    }

    if (liters <= 0) {
      setError(
        'Količina goriva mora biti veća od 0.',
      )
      return
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !Number.isFinite(price) || price <= 0) {
      setError(
        'Cijena po litri mora biti veća od 0.',
      )
      return
    }

    if (mileage < 0) {
      setError(
        'Kilometraža ne može biti negativna.',
      )
      return
    }

    const existingRecord = editingRecordId
      ? fuelRecords.find((record) => record.id === editingRecordId)
      : null

    const fuelRecord = {
      ...(existingRecord || {}),
      id: editingRecordId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      date: formData.date,
      liters,
      price,
      unitPrice,
      station: formData.station.trim(),
      fullTank: formData.fullTank,
      mileage,
    }

    if (editingRecordId) {
      onUpdateFuelRecord(fuelRecord)
    } else {
      onAddFuelRecord(fuelRecord)
    }

    resetForm()
  }

  function handleEditRecord(record) {
    setFormData({
      vehicleId: String(record.vehicleId),
      date: record.date,
      liters: record.liters,
      price: record.price,
      unitPrice: record.unitPrice ?? (Number(record.liters) > 0
        ? (Number(record.price) / Number(record.liters)).toFixed(3)
        : ''),
      station: record.station || '',
      fullTank: record.fullTank === true,
      mileage: record.mileage,
    })

    setError('')
    setEditingRecordId(record.id)
    setShowForm(true)
  }

  function handleCancelEdit() {
    resetForm()
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  const totalFuelCost = fuelRecords.reduce(
    (total, record) =>
      total + Number(record.price),
    0,
  )

  const totalLiters = fuelRecords.reduce(
    (total, record) =>
      total + Number(record.liters),
    0,
  )

  function calculateConsumption() {
    if (fuelRecords.length < 2) {
      return null
    }

    const sortedRecords = [...fuelRecords].sort(
      (a, b) =>
        Number(a.mileage) - Number(b.mileage),
    )

    const firstRecord = sortedRecords[0]
    const lastRecord =
      sortedRecords[sortedRecords.length - 1]

    const kilometers =
      Number(lastRecord.mileage) -
      Number(firstRecord.mileage)

    if (kilometers <= 0) {
      return null
    }

    const litersAfterFirst =
      sortedRecords
        .slice(1)
        .reduce(
          (total, record) =>
            total + Number(record.liters),
          0,
        )

    if (litersAfterFirst <= 0) {
      return null
    }

    return (
      (litersAfterFirst / kilometers) *
      100
    )
  }

  const averageConsumption =
    calculateConsumption()

  const detailedFuelStatistics = statisticsVehicleId
    ? calculateVehicleFuelStatistics(fuelRecords, statisticsVehicleId)
    : calculateFuelStatistics(fuelRecords)

  const statisticsRecords = statisticsVehicleId
    ? fuelRecords.filter(
        (record) => String(record.vehicleId) === statisticsVehicleId,
      )
    : fuelRecords

  function formatFuelNumber(value, digits = 2) {
    if (value === null || !Number.isFinite(value)) {
      return 'Nedovoljno podataka'
    }

    return value.toLocaleString('hr-HR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  }


  const filteredFuelRecords = filterVehicleId
    ? fuelRecords.filter((record) => String(record.vehicleId) === filterVehicleId)
    : fuelRecords

  const consumptionPoints = []
  const fuelByVehicle = new Map()
  filteredFuelRecords.forEach((record) => {
    const key = String(record.vehicleId)
    if (!fuelByVehicle.has(key)) fuelByVehicle.set(key, [])
    fuelByVehicle.get(key).push(record)
  })
  fuelByVehicle.forEach((records, vehicleId) => {
    const sorted = [...records].sort((a, b) => Number(a.mileage) - Number(b.mileage))
    for (let i = 1; i < sorted.length; i += 1) {
      const distance = Number(sorted[i].mileage) - Number(sorted[i - 1].mileage)
      if (distance <= 0 || Number(sorted[i].liters) <= 0) continue
      const vehicle = vehicles.find((item) => String(item.id) === vehicleId)
      consumptionPoints.push({
        label: sorted[i].date ? sorted[i].date.slice(5).replace('-', '.') : String(i),
        value: (Number(sorted[i].liters) / distance) * 100,
        date: sorted[i].date,
        vehicle: vehicle ? `${vehicle.brand} ${vehicle.model}` : vehicleId,
      })
    }
  })
  consumptionPoints.sort((a, b) => String(a.date).localeCompare(String(b.date)))

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            EVIDENCIJA
          </p>

          <h1>
            Gorivo
          </h1>

          <p className="page-description">
            Prati točenja goriva, kilometražu
            i troškove svojih motocikala.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (showForm) {
              handleCancelEdit()
            } else {
              setShowForm(true)
            }
          }}
          disabled={vehicles.length === 0}
        >
          {showForm
            ? 'Zatvori'
            : '+ Dodaj točenje'}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            ⛽
          </div>

          <h2>
            Prvo dodaj motocikl
          </h2>

          <p>
            Za evidenciju goriva potrebno je
            prvo dodati motocikl u svoju garažu.
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {fuelRecords.length > 0 && (
            <div className="fuel-summary">
              <div className="fuel-summary-card">
                <span>
                  Ukupno točenja
                </span>

                <strong>
                  {fuelRecords.length}
                </strong>
              </div>

              <div className="fuel-summary-card">
                <span>
                  Ukupno goriva
                </span>

                <strong>
                  {totalLiters.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  L
                </strong>
              </div>

              <div className="fuel-summary-card">
                <span>
                  Ukupno potrošeno
                </span>

                <strong>
                  {totalFuelCost.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>

              <div className="fuel-summary-card">
                <span>
                  Prosječna potrošnja
                </span>

                <strong>
                  {averageConsumption !== null
                    ? `${averageConsumption.toLocaleString(
                        'hr-HR',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )} L/100 km`
                    : 'Nedovoljno podataka'}
                </strong>
              </div>
            </div>
          )}

          <div className="analytics-filter">
            <label htmlFor="fuel-record-filter">Prikaži točenja za motocikl</label>
            <select id="fuel-record-filter" value={filterVehicleId} onChange={(event) => setFilterVehicleId(event.target.value)}>
              <option value="">Svi motocikli</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model}</option>)}
            </select>
          </div>
          <div className="analytics-section">
            <LinijskiGraf title="Graf potrošnje goriva" subtitle="Procjena L/100 km između uzastopnih unosa kilometraže za isti motocikl. Za usporedbu odaberi jedan motocikl." points={consumptionPoints} unit="L/100 km" />
          </div>

          {fuelRecords.length > 0 && (
            <div className="fuel-statistics">
              <div className="form-header">
                <h2>Detaljna statistika goriva</h2>
                <p>
                  Pregled cijena goriva i troška po kilometru.
                  Za točan izračun odaberi pojedini motocikl.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="fuel-statistics-vehicle">
                  Statistika za motocikl
                </label>
                <select
                  id="fuel-statistics-vehicle"
                  value={statisticsVehicleId}
                  onChange={(event) =>
                    setStatisticsVehicleId(event.target.value)
                  }
                >
                  <option value="">Svi motocikli</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              {statisticsRecords.length > 0 ? (
                <div className="fuel-summary">
                  <div className="fuel-summary-card">
                    <span>Prosječna cijena litre</span>
                    <strong>
                      {formatFuelNumber(
                        detailedFuelStatistics.averagePricePerLiter,
                        2,
                      )} €/L
                    </strong>
                  </div>
                  <div className="fuel-summary-card">
                    <span>Najniža cijena litre</span>
                    <strong>
                      {formatFuelNumber(
                        detailedFuelStatistics.lowestPricePerLiter,
                        2,
                      )} €/L
                    </strong>
                  </div>
                  <div className="fuel-summary-card">
                    <span>Najviša cijena litre</span>
                    <strong>
                      {formatFuelNumber(
                        detailedFuelStatistics.highestPricePerLiter,
                        2,
                      )} €/L
                    </strong>
                  </div>
                  <div className="fuel-summary-card">
                    <span>Trošak goriva po kilometru</span>
                    <strong>
                      {statisticsVehicleId
                        ? detailedFuelStatistics.fuelCostPerKm !== null
                          ? `${formatFuelNumber(
                              detailedFuelStatistics.fuelCostPerKm,
                              3,
                            )} €/km`
                          : 'Nedovoljno podataka'
                        : 'Odaberi motocikl'}
                    </strong>
                  </div>
                </div>
              ) : (
                <p>Za ovaj motocikl još nema evidentiranih točenja.</p>
              )}
            </div>
          )}

          {showForm && (
            <form
              className="vehicle-form"
              onSubmit={handleSubmit}
            >
              <div className="form-header">
                <h2>
                  {editingRecordId
                    ? 'Uredi točenje goriva'
                    : 'Dodaj točenje goriva'}
                </h2>

                <p>
                  {editingRecordId
                    ? 'Promijeni podatke o točenju goriva.'
                    : 'Unesi podatke o točenju goriva.'}
                </p>
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="vehicleId">
                    Motocikl
                  </label>

                  <select
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Odaberi motocikl
                    </option>

                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.brand}{' '}
                        {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">
                    Datum
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="liters">
                    Količina goriva
                  </label>

                  <input
                    id="liters"
                    name="liters"
                    type="number"
                    placeholder="npr. 14.5"
                    min="0"
                    step="0.01"
                    value={formData.liters}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unitPrice">
                    Cijena po litri (€/L)
                  </label>

                  <input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    placeholder="npr. 1.52"
                    min="0.001"
                    step="0.001"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mileage">
                    Kilometraža
                  </label>

                  <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    placeholder="npr. 26500"
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fuel-total-price">
                    Ukupna cijena točenja (€)
                  </label>
                  <input
                    id="fuel-total-price"
                    type="text"
                    value={
                      formData.liters !== '' && formData.unitPrice !== '' &&
                      Number(formData.liters) > 0 && Number(formData.unitPrice) > 0
                        ? (Math.round(Number(formData.liters) * Number(formData.unitPrice) * 100) / 100)
                            .toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
                        : ''
                    }
                    placeholder="Izračunava se automatski"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="station">
                    Benzinska postaja (neobavezno)
                  </label>
                  <input
                    id="station"
                    name="station"
                    type="text"
                    placeholder="npr. INA, Petrol, Tifon"
                    value={formData.station}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="fullTank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: 'fit-content',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      id="fullTank"
                      name="fullTank"
                      type="checkbox"
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        margin: 0,
                        padding: 0,
                        flex: 'none',
                        accentColor: '#e63946',
                        cursor: 'pointer',
                      }}
                      checked={formData.fullTank}
                      onChange={handleChange}
                    />{' '}
                    Spremnik napunjen do vrha
                  </label>
                </div>
              </div>

              <div className="form-actions">
                {editingRecordId && (
                  <button
                    type="button"
                    className="fuel-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Odustani
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingRecordId
                    ? 'Spremi promjene'
                    : 'Spremi točenje'}
                </button>
              </div>
            </form>
          )}

          {fuelRecords.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  ⛽
                </div>

                <h2>
                  Nema evidentiranih točenja
                </h2>

                <p>
                  Dodaj prvo točenje goriva kako
                  bi mogao pratiti potrošnju i
                  troškove.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Dodaj prvo točenje
                </button>
              </div>
            )}

          {fuelRecords.length > 0 && (
            <div className="fuel-list">
              {filteredFuelRecords.map((record) => {
                const vehicle = getVehicle(
                  record.vehicleId,
                )

                return (
                  <article
                    className="fuel-card"
                    key={record.id}
                  >
                    <div className="fuel-card-main">
                      <div className="fuel-icon">
                        ⛽
                      </div>

                      <div>
                        <h2>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : 'Nepoznati motocikl'}
                        </h2>

                        <p>
                          {new Date(
                            record.date,
                          ).toLocaleDateString(
                            'hr-HR',
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="fuel-card-details">
                      <div>
                        <span>
                          Gorivo
                        </span>

                        <strong>
                          {Number(
                            record.liters,
                          ).toLocaleString(
                            'hr-HR',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{' '}
                          L
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cijena
                        </span>

                        <strong>
                          {Number(
                            record.price,
                          ).toLocaleString(
                            'hr-HR',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{' '}
                          €
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cijena po litri
                        </span>

                        <strong>
                          {calculatePricePerLiter(record) !== null
                            ? `${formatFuelNumber(
                                calculatePricePerLiter(record),
                                2,
                              )} €/L`
                            : 'Nedovoljno podataka'}
                        </strong>
                      </div>

                      {record.station && (
                        <div>
                          <span>Benzinska postaja</span>
                          <strong>{record.station}</strong>
                        </div>
                      )}

                      {record.fullTank === true && (
                        <div>
                          <span>Spremnik</span>
                          <strong>Napunjeno do vrha</strong>
                        </div>
                      )}

                      <div>
                        <span>
                          Kilometraža
                        </span>

                        <strong>
                          {Number(
                            record.mileage,
                          ).toLocaleString(
                            'hr-HR',
                          )}{' '}
                          km
                        </strong>
                      </div>

                      <div className="fuel-actions">
                        <button
                          type="button"
                          className="fuel-edit-button"
                          onClick={() =>
                            handleEditRecord(
                              record,
                            )
                          }
                        >
                          Uredi
                        </button>

                        <button
                          type="button"
                          className="fuel-delete-button"
                          onClick={() =>
                            onDeleteFuelRecord(
                              record.id,
                            )
                          }
                        >
                          Obriši
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Gorivo
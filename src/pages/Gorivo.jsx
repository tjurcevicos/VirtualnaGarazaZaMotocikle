import { useState } from 'react'

function Gorivo({
  vehicles,
  fuelRecords,
  onAddFuelRecord,
  onDeleteFuelRecord,
  onUpdateFuelRecord,
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingRecordId, setEditingRecordId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: '',
    liters: '',
    price: '',
    mileage: '',
  })

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  function resetForm() {
    setFormData({
      vehicleId: '',
      date: '',
      liters: '',
      price: '',
      mileage: '',
    })

    setEditingRecordId(null)
    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const liters = Number(formData.liters)
    const price = Number(formData.price)
    const mileage = Number(formData.mileage)

    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.liters ||
      !formData.price ||
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

    if (price <= 0) {
      setError(
        'Cijena goriva mora biti veća od 0.',
      )
      return
    }

    if (mileage < 0) {
      setError(
        'Kilometraža ne može biti negativna.',
      )
      return
    }

    const fuelRecord = {
      id: editingRecordId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      date: formData.date,
      liters,
      price,
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
                  <label htmlFor="price">
                    Cijena
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="npr. 24.50"
                    min="0"
                    step="0.01"
                    value={formData.price}
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
              {fuelRecords.map((record) => {
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
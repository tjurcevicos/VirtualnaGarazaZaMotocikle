import { exportGaragePdf } from '../utils/pdfExport'

import { useEffect, useRef, useState } from 'react'
import {
  getPhoto,
  savePhoto,
  deletePhoto,
} from '../utils/photoStorage'

function DetaljiVozila({
  vehicle,
  services,
  expenses,
  onBack,
  onDelete,
  onAddService,
  onDeleteService,
  onUpdateVehicle,
}) {
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [isSavingVehicle, setIsSavingVehicle] = useState(false)
  const [vehicleError, setVehicleError] = useState('')

  const [vehicleForm, setVehicleForm] = useState({
    brand: vehicle.brand ?? '',
    model: vehicle.model ?? '',
    year: String(vehicle.year ?? ''),
    fuel: vehicle.fuel ?? '',
    mileage: String(vehicle.mileage ?? ''),
    initialMileage: String(vehicle.initialMileage ?? ''),
  })

  const [serviceData, setServiceData] = useState({
    date: '',
    description: '',
    mileage: '',
    price: '',
  })

  const [error, setError] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)

  const photoInputRef = useRef(null)

  const vehicleServices = services.filter(
    (service) => service.vehicleId === vehicle.id,
  )

  const vehicleExpenses = expenses.filter(
    (expense) => Number(expense.vehicleId) === Number(vehicle.id),
  )

  const totalVehicleExpenses = vehicleExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  )

  useEffect(() => {
    setVehicleForm({
      brand: vehicle.brand ?? '',
      model: vehicle.model ?? '',
      year: String(vehicle.year ?? ''),
      fuel: vehicle.fuel ?? '',
      mileage: String(vehicle.mileage ?? ''),
    initialMileage: String(vehicle.initialMileage ?? ''),
    })

    setShowVehicleForm(false)
    setVehicleError('')
  }, [
    vehicle.id,
    vehicle.brand,
    vehicle.model,
    vehicle.year,
    vehicle.fuel,
    vehicle.mileage,
    vehicle.initialMileage,
  ])

  useEffect(() => {
    let cancelled = false
    let loadedUrl = null

    setPhotoUrl(null)
    setPhotoError('')

    async function loadVehiclePhoto() {
      try {
        const url = await getPhoto(vehicle.id)
        loadedUrl = url

        if (cancelled) {
          if (url) URL.revokeObjectURL(url)
          return
        }

        setPhotoUrl(url)
      } catch (loadError) {
        console.error(
          'Učitavanje fotografije nije uspjelo:',
          loadError,
        )

        if (!cancelled) {
          setPhotoError(
            'Fotografiju nije moguće učitati. Pokušaj ponovno.',
          )
        }
      }
    }

    loadVehiclePhoto()

    return () => {
      cancelled = true

      if (loadedUrl) {
        URL.revokeObjectURL(loadedUrl)
      }
    }
  }, [vehicle.id])

  function handleVehicleChange(event) {
    const { name, value } = event.target

    setVehicleForm((current) => ({
      ...current,
      [name]: value,
    }))

    setVehicleError('')
  }

  function resetVehicleForm() {
    setVehicleForm({
      brand: vehicle.brand ?? '',
      model: vehicle.model ?? '',
      year: String(vehicle.year ?? ''),
      fuel: vehicle.fuel ?? '',
      mileage: String(vehicle.mileage ?? ''),
    initialMileage: String(vehicle.initialMileage ?? ''),
    })

    setVehicleError('')
    setShowVehicleForm(false)
  }

  function handleVehicleSubmit(event) {
    event.preventDefault()

    if (isSavingVehicle) return

    const brand = vehicleForm.brand.trim()
    const model = vehicleForm.model.trim()
    const year = Number(vehicleForm.year)
    const mileage = Number(vehicleForm.mileage)
    const initialMileage = Number(vehicleForm.initialMileage)
    const currentYear = new Date().getFullYear()

    if (
      !brand ||
      !model ||
      !vehicleForm.year ||
      !vehicleForm.fuel ||
      vehicleForm.mileage === ''
    ) {
      setVehicleError('Molimo ispuni sva obavezna polja.')
      return
    }

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > currentYear
    ) {
      setVehicleError(
        `Godina motocikla mora biti između 1900. i ${currentYear}.`,
      )
      return
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      setVehicleError('Kilometraža ne može biti negativna.')
      return
    }

    if (vehicleForm.initialMileage === '' || !Number.isFinite(initialMileage) || initialMileage < 0 || initialMileage > mileage) {
      setVehicleError('Početna kilometraža mora biti između 0 i trenutačne kilometraže.')
      return
    }

    setIsSavingVehicle(true)

    try {
      onUpdateVehicle({
        ...vehicle,
        brand,
        model,
        year,
        fuel: vehicleForm.fuel,
        mileage,
        initialMileage,
      })

      setShowVehicleForm(false)
      setVehicleError('')
    } catch (saveError) {
      console.error(
        'Ažuriranje motocikla nije uspjelo:',
        saveError,
      )

      setVehicleError(
        'Podatke nije moguće spremiti. Pokušaj ponovno.',
      )
    } finally {
      setIsSavingVehicle(false)
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setPhotoError('')

    if (!file.type.startsWith('image/')) {
      setPhotoError(
        'Odabrana datoteka mora biti fotografija.',
      )
      event.target.value = ''
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError(
        'Fotografija ne smije biti veća od 8 MB.',
      )
      event.target.value = ''
      return
    }

    setIsSavingPhoto(true)

    try {
      await savePhoto(vehicle.id, file)

      const newUrl = await getPhoto(vehicle.id)

      setPhotoUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl)
        }

        return newUrl
      })
    } catch (saveError) {
      console.error(
        'Spremanje fotografije nije uspjelo:',
        saveError,
      )

      setPhotoError(
        'Fotografiju nije moguće spremiti. Pokušaj ponovno.',
      )
    } finally {
      setIsSavingPhoto(false)

      if (photoInputRef.current) {
        photoInputRef.current.value = ''
      }
    }
  }

  async function handleRemovePhoto() {
    if (isSavingPhoto) return

    setIsSavingPhoto(true)
    setPhotoError('')

    try {
      await deletePhoto(vehicle.id)

      setPhotoUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl)
        }

        return null
      })
    } catch (removeError) {
      console.error(
        'Uklanjanje fotografije nije uspjelo:',
        removeError,
      )

      setPhotoError(
        'Fotografiju nije moguće ukloniti. Pokušaj ponovno.',
      )
    } finally {
      setIsSavingPhoto(false)
    }
  }

  function handleServiceChange(event) {
    const { name, value } = event.target

    setServiceData((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  function resetServiceForm() {
    setServiceData({
      date: '',
      description: '',
      mileage: '',
      price: '',
    })

    setError('')
    setShowServiceForm(false)
  }

  function handleServiceSubmit(event) {
    event.preventDefault()

    const mileage = Number(serviceData.mileage)
    const price = Number(serviceData.price)
    const today = new Date().toISOString().split('T')[0]

    if (
      !serviceData.date ||
      !serviceData.description.trim() ||
      serviceData.mileage === '' ||
      serviceData.price === ''
    ) {
      setError('Molimo ispuni sva polja.')
      return
    }

    if (serviceData.date > today) {
      setError('Datum servisa ne može biti u budućnosti.')
      return
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      setError('Kilometraža ne može biti negativna.')
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError('Cijena servisa mora biti veća od 0.')
      return
    }

    onAddService({
      id: Date.now(),
      vehicleId: vehicle.id,
      date: serviceData.date,
      description: serviceData.description.trim(),
      mileage,
      price,
    })

    resetServiceForm()
  }

  async function handleVehiclePdf() {
    setPdfError('')
    setPdfBusy(true)
    try {
      const initial = vehicle.initialMileage === '' || vehicle.initialMileage == null ? null : Number(vehicle.initialMileage)
      const traveled = initial !== null && Number.isFinite(initial) && Number(vehicle.mileage) > initial ? Number(vehicle.mileage) - initial : null
      const rows = [
        ...vehicleExpenses.filter((expense) => !(String(expense.category || '').toLocaleLowerCase('hr-HR').trim() === 'servis' && vehicleServices.length > 0)).map((expense) => ({ ...expense, vehicle: `${vehicle.brand} ${vehicle.model}` })),
        ...vehicleServices.map((service) => ({ ...service, amount: service.price, category: 'Servis', vehicle: `${vehicle.brand} ${vehicle.model}` })),
      ]
      const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0)
      await exportGaragePdf({
        title: `Izvještaj: ${vehicle.brand} ${vehicle.model}`,
        subtitle: `Godina: ${vehicle.year} · Gorivo: ${vehicle.fuel}`,
        summary: [
          ['Trenutačna kilometraža', `${Number(vehicle.mileage).toLocaleString('hr-HR')} km`],
          ['Prijeđeno od početka evidencije', traveled === null ? 'Nema podataka' : `${traveled.toLocaleString('hr-HR')} km`],
          ['Po kilometru', traveled === null ? 'Nema podataka' : `${(total / traveled).toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/km`],
        ],
        rows,
        filename: `virtualna-garaza-motocikl-${vehicle.id}.pdf`,
      })
    } catch (error) {
      console.error('Izvoz PDF-a nije uspio:', error)
      setPdfError('Izvještaj nije moguće izvesti. Pokušaj ponovno.')
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <section className="page vehicle-detail-page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Natrag na motocikle
      </button>

      <div className="vehicle-detail-header">
        <div className="vehicle-detail-icon">🏍️</div>

        <div>
          <p className="page-label">MOTOCIKL</p>

          <h1>
            {vehicle.brand} {vehicle.model}
          </h1>

          <p className="page-description">
            {vehicle.year} • {vehicle.fuel}
          </p>
        </div>
      </div>

      <div className="detail-section vehicle-photo-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">MOJA GARAŽA</p>
            <h2>Fotografija motocikla</h2>
          </div>
        </div>

        <div className="detail-vehicle-photo">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
            />
          ) : (
            <div className="detail-no-photo">
              <span>🏍️</span>
              <p>Još nema fotografije ovog motocikla.</p>
            </div>
          )}
        </div>

        {photoError && (
          <div className="form-error" role="alert">
            {photoError}
          </div>
        )}

        <div className="vehicle-photo-actions">
          <label
            htmlFor="detailVehiclePhoto"
            className={`primary-button ${
              isSavingPhoto ? 'photo-button-disabled' : ''
            }`}
          >
            {isSavingPhoto
              ? 'Spremanje...'
              : photoUrl
                ? 'Promijeni fotografiju'
                : 'Dodaj fotografiju'}
          </label>

          <input
            ref={photoInputRef}
            id="detailVehiclePhoto"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={isSavingPhoto}
            hidden
          />

          {photoUrl && (
            <button
              type="button"
              className="service-cancel-button"
              onClick={handleRemovePhoto}
              disabled={isSavingPhoto}
            >
              Ukloni fotografiju
            </button>
          )}
        </div>

        <p className="photo-help">
          Odaberi sliku do 8 MB. Fotografija se sprema uz ovaj motocikl.
        </p>
      </div>


      <div className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">PODACI</p>
            <h2>Podaci o motociklu</h2>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              showVehicleForm
                ? resetVehicleForm()
                : setShowVehicleForm(true)
            }
            disabled={isSavingVehicle}
          >
            {showVehicleForm ? 'Odustani' : 'Uredi podatke'}
          </button>
        </div>

        {showVehicleForm && (
          <form
            className="vehicle-form"
            onSubmit={handleVehicleSubmit}
          >
            <div className="form-header">
              <h2>Uredi motocikl</h2>
              <p>
                Izmijeni osnovne podatke svog motocikla.
              </p>
            </div>

            {vehicleError && (
              <div className="form-error" role="alert">
                {vehicleError}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="editVehicleBrand">
                  Marka
                </label>
                <input
                  id="editVehicleBrand"
                  name="brand"
                  value={vehicleForm.brand}
                  onChange={handleVehicleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editVehicleModel">
                  Model
                </label>
                <input
                  id="editVehicleModel"
                  name="model"
                  value={vehicleForm.model}
                  onChange={handleVehicleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editVehicleYear">
                  Godina
                </label>
                <input
                  id="editVehicleYear"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={vehicleForm.year}
                  onChange={handleVehicleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editVehicleFuel">
                  Gorivo
                </label>
                <select
                  id="editVehicleFuel"
                  name="fuel"
                  value={vehicleForm.fuel}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="">Odaberi gorivo</option>
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Električni">Električni</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editVehicleMileage">
                  Kilometraža
                </label>
                <input
                  id="editVehicleMileage"
                  name="mileage"
                  type="number"
                  min="0"
                  step="1"
                  value={vehicleForm.mileage}
                  onChange={handleVehicleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editInitialMileage">Početna kilometraža evidencije (km)</label>
                <input id="editInitialMileage" name="initialMileage" type="number" min="0" step="1" value={vehicleForm.initialMileage} onChange={handleVehicleChange} required />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="service-cancel-button"
                onClick={resetVehicleForm}
                disabled={isSavingVehicle}
              >
                Odustani
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={isSavingVehicle}
              >
                {isSavingVehicle
                  ? 'Spremanje...'
                  : 'Spremi promjene'}
              </button>
            </div>
          </form>
        )}

        <div className="vehicle-detail-grid">
          <div className="detail-card">
            <span>Marka</span>
            <strong>{vehicle.brand}</strong>
          </div>

          <div className="detail-card">
            <span>Model</span>
            <strong>{vehicle.model}</strong>
          </div>

          <div className="detail-card">
            <span>Godina</span>
            <strong>{vehicle.year}</strong>
          </div>

          <div className="detail-card">
            <span>Gorivo</span>
            <strong>{vehicle.fuel}</strong>
          </div>

          <div className="detail-card">
            <span>Kilometraža</span>
            <strong>
              {Number(vehicle.mileage).toLocaleString('hr-HR')} km
            </strong>
          </div>
          <div className="detail-card">
            <span>Početna kilometraža evidencije</span>
            <strong>{vehicle.initialMileage === undefined || vehicle.initialMileage === null ? 'Nije unesena' : `${Number(vehicle.initialMileage).toLocaleString('hr-HR')} km`}</strong>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">ODRŽAVANJE</p>
            <h2>Servisna povijest</h2>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              showServiceForm
                ? resetServiceForm()
                : setShowServiceForm(true)
            }
          >
            {showServiceForm ? 'Zatvori' : '+ Dodaj servis'}
          </button>
        </div>

        {showServiceForm && (
          <form
            className="service-form"
            onSubmit={handleServiceSubmit}
          >
            <div className="form-header">
              <h2>Dodaj servis</h2>
              <p>Unesi podatke o obavljenom servisu.</p>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="detailServiceDate">Datum</label>
                <input
                  id="detailServiceDate"
                  name="date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={serviceData.date}
                  onChange={handleServiceChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="detailServiceMileage">
                  Kilometraža
                </label>
                <input
                  id="detailServiceMileage"
                  name="mileage"
                  type="number"
                  placeholder="npr. 25000"
                  min="0"
                  step="1"
                  value={serviceData.mileage}
                  onChange={handleServiceChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="detailServicePrice">Cijena</label>
                <input
                  id="detailServicePrice"
                  name="price"
                  type="number"
                  placeholder="npr. 150"
                  min="0.01"
                  step="0.01"
                  value={serviceData.price}
                  onChange={handleServiceChange}
                  required
                />
              </div>

              <div className="form-group service-description-group">
                <label htmlFor="detailServiceDescription">
                  Opis servisa
                </label>
                <input
                  id="detailServiceDescription"
                  name="description"
                  type="text"
                  placeholder="npr. Zamjena ulja i filtera"
                  value={serviceData.description}
                  onChange={handleServiceChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="service-cancel-button"
                onClick={resetServiceForm}
              >
                Odustani
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Spremi servis
              </button>
            </div>
          </form>
        )}

        {vehicleServices.length === 0 && !showServiceForm && (
          <div className="coming-soon-card">
            <div className="coming-soon-icon">🔧</div>
            <h3>Nema evidentiranih servisa</h3>
            <p>
              Dodaj prvi servis ovog motocikla kako bi imao pregled
              održavanja.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowServiceForm(true)}
            >
              + Dodaj prvi servis
            </button>
          </div>
        )}

        {vehicleServices.length > 0 && (
          <div className="services-list">
            {vehicleServices.map((service) => (
              <article
                className="service-card"
                key={service.id}
              >
                <div className="service-card-main">
                  <div className="service-icon">🔧</div>

                  <div>
                    <h3>{service.description}</h3>
                    <p>
                      {new Date(service.date).toLocaleDateString('hr-HR')}
                    </p>
                  </div>
                </div>

                <div className="service-card-details">
                  <div>
                    <span>Kilometraža</span>
                    <strong>
                      {Number(service.mileage).toLocaleString('hr-HR')} km
                    </strong>
                  </div>

                  <div>
                    <span>Cijena</span>
                    <strong>
                      {Number(service.price).toLocaleString('hr-HR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="service-delete-button"
                    onClick={() => onDeleteService(service.id)}
                  >
                    Obriši
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">TROŠKOVI</p>
            <h2>Troškovi motocikla</h2>
            <button type="button" className="primary-button" onClick={handleVehiclePdf} disabled={pdfBusy || (vehicleExpenses.length === 0 && vehicleServices.length === 0)}>
              {pdfBusy ? 'Izvoz...' : 'PDF izvještaj'}
            </button>
            {pdfError && <div className="form-error" role="alert">{pdfError}</div>}
            <p className="page-description">
              Evidencija troškova za ovaj motocikl.
            </p>
          </div>
        </div>
        <div className="vehicle-detail-grid">
          <div className="detail-card">
            <span>Broj troškova</span>
            <strong>{vehicleExpenses.length}</strong>
          </div>
          <div className="detail-card">
            <span>Ukupno potrošeno</span>
            <strong>
              {totalVehicleExpenses.toLocaleString('hr-HR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' ' }
              €
            </strong>
          </div>
        </div>
        {vehicleExpenses.length === 0 ? (
          <div className="coming-soon-card">
            <div className="coming-soon-icon">€</div>
            <h3>Nema evidentiranih troškova</h3>
            <p>
              Troškove možeš dodati na stranici Troškovi. Kada ih povežeš
              s ovim motociklom, prikazat će se ovdje.
            </p>
          </div>
        ) : (
          <div className="services-list">
            {vehicleExpenses
              .slice()
              .sort((a, b) => String(b.date).localeCompare(String(a.date)))
              .map((expense) => (
                <article className="service-card" key={expense.id}>
                  <div className="service-card-main">
                    <div className="service-icon">€</div>
                    <div>
                      <h3>{expense.description || expense.category}</h3>
                      <p>{expense.category}</p>
                      <p>
                        {expense.date
                          ? new Date(`${expense.date}T00:00:00`).toLocaleDateString('hr-HR')
                          : 'Datum nije naveden'}
                      </p>
                    </div>
                  </div>
                  <div className="service-card-details">
                    <div>
                      <span>Iznos</span>
                      <strong>
                        {Number(expense.amount || 0).toLocaleString('hr-HR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' ' }
                        €
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
      </div>
      <div className="detail-actions">
        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(vehicle.id)}
        >
          Obriši motocikl
        </button>
      </div>
    </section>
  )
}

export default DetaljiVozila

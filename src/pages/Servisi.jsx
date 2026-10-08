import { useState } from 'react'

function Servisi({
  vehicles,
  services,
  onAddService,
  onDeleteService,
  onUpdateService,
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingServiceId, setEditingServiceId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: '',
    description: '',
    mileage: '',
    price: '',
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
      description: '',
      mileage: '',
      price: '',
    })

    setEditingServiceId(null)
    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const mileage = Number(formData.mileage)
    const price = Number(formData.price)

    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.description.trim() ||
      formData.mileage === '' ||
      formData.price === ''
    ) {
      setError('Molimo ispuni sva polja.')
      return
    }

    if (mileage < 0) {
      setError(
        'Kilometraža ne može biti negativna.',
      )
      return
    }

    if (price <= 0) {
      setError(
        'Cijena servisa mora biti veća od 0.',
      )
      return
    }

    const selectedVehicle = vehicles.find(
      (vehicle) =>
        vehicle.id === Number(formData.vehicleId),
    )

    if (!selectedVehicle) {
      setError(
        'Odabrani motocikl nije pronađen.',
      )
      return
    }

    const service = {
      id: editingServiceId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      date: formData.date,
      description: formData.description.trim(),
      mileage,
      price,
    }

    if (editingServiceId) {
      onUpdateService(service)
    } else {
      onAddService(service)
    }

    resetForm()
  }

  function handleEditService(service) {
    setFormData({
      vehicleId: String(service.vehicleId),
      date: service.date,
      description: service.description,
      mileage: service.mileage,
      price: service.price,
    })

    setError('')
    setEditingServiceId(service.id)
    setShowForm(true)
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  const totalServiceCost = services.reduce(
    (total, service) =>
      total + Number(service.price),
    0,
  )

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            ODRŽAVANJE
          </p>

          <h1>
            Servisi
          </h1>

          <p className="page-description">
            Pregledaj i evidentiraj servise svih
            svojih motocikala.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          disabled={vehicles.length === 0}
        >
          {showForm
            ? 'Zatvori'
            : '+ Dodaj servis'}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            🔧
          </div>

          <h2>
            Prvo dodaj motocikl
          </h2>

          <p>
            Za evidentiranje servisa potrebno
            je prvo dodati motocikl u svoju
            garažu.
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {services.length > 0 && (
            <div className="service-summary">
              <div className="service-summary-card">
                <span>
                  Ukupno servisa
                </span>

                <strong>
                  {services.length}
                </strong>
              </div>

              <div className="service-summary-card">
                <span>
                  Ukupno potrošeno
                </span>

                <strong>
                  {totalServiceCost.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>
            </div>
          )}

          {showForm && (
            <form
              className="vehicle-form service-page-form"
              onSubmit={handleSubmit}
            >
              <div className="form-header">
                <h2>
                  {editingServiceId
                    ? 'Uredi servis'
                    : 'Dodaj servis'}
                </h2>

                <p>
                  {editingServiceId
                    ? 'Promijeni podatke o servisu.'
                    : 'Unesi podatke o obavljenom servisu.'}
                </p>
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="serviceVehicleId">
                    Motocikl
                  </label>

                  <select
                    id="serviceVehicleId"
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
                  <label htmlFor="serviceDate">
                    Datum
                  </label>

                  <input
                    id="serviceDate"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serviceMileage">
                    Kilometraža
                  </label>

                  <input
                    id="serviceMileage"
                    name="mileage"
                    type="number"
                    placeholder="npr. 25000"
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="servicePrice">
                    Cijena
                  </label>

                  <input
                    id="servicePrice"
                    name="price"
                    type="number"
                    placeholder="npr. 150"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group service-description-group">
                  <label htmlFor="serviceDescription">
                    Opis servisa
                  </label>

                  <input
                    id="serviceDescription"
                    name="description"
                    type="text"
                    placeholder="npr. Zamjena ulja i filtera"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                {editingServiceId && (
                  <button
                    type="button"
                    className="service-cancel-button"
                    onClick={resetForm}
                  >
                    Odustani
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingServiceId
                    ? 'Spremi promjene'
                    : 'Spremi servis'}
                </button>
              </div>
            </form>
          )}

          {services.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  🔧
                </div>

                <h2>
                  Nema evidentiranih servisa
                </h2>

                <p>
                  Dodaj prvi servis kako bi imao
                  pregled održavanja svojih
                  motocikala.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Dodaj prvi servis
                </button>
              </div>
            )}

          {services.length > 0 && (
            <div className="services-list">
              {services.map((service) => {
                const vehicle = getVehicle(
                  service.vehicleId,
                )

                return (
                  <article
                    className="service-card"
                    key={service.id}
                  >
                    <div className="service-card-main">
                      <div className="service-icon">
                        🔧
                      </div>

                      <div>
                        <h3>
                          {service.description}
                        </h3>

                        <p>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : 'Nepoznati motocikl'}
                        </p>

                        <small>
                          {new Date(
                            service.date,
                          ).toLocaleDateString(
                            'hr-HR',
                          )}
                        </small>
                      </div>
                    </div>

                    <div className="service-card-details">
                      <div>
                        <span>
                          Kilometraža
                        </span>

                        <strong>
                          {Number(
                            service.mileage,
                          ).toLocaleString(
                            'hr-HR',
                          )}{' '}
                          km
                        </strong>
                      </div>

                      <div>
                        <span>
                          Cijena
                        </span>

                        <strong>
                          {Number(
                            service.price,
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

                      <div className="service-actions">
                        <button
                          type="button"
                          className="service-edit-button"
                          onClick={() =>
                            handleEditService(
                              service,
                            )
                          }
                        >
                          Uredi
                        </button>

                        <button
                          type="button"
                          className="service-delete-button"
                          onClick={() =>
                            onDeleteService(
                              service.id,
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

export default Servisi
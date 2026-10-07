import { useState } from 'react'

function Vozila({
  vehicles,
  onAddVehicle,
  onSelectVehicle,
}) {
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel: '',
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
      brand: '',
      model: '',
      year: '',
      fuel: '',
      mileage: '',
    })

    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const year = Number(formData.year)
    const mileage = Number(formData.mileage)

    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.fuel ||
      !formData.mileage
    ) {
      setError('Molimo ispuni sva polja.')
      return
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      setError(
        `Godina motocikla mora biti između 1900. i ${new Date().getFullYear()}.`,
      )
      return
    }

    if (mileage < 0) {
      setError(
        'Kilometraža ne može biti negativna.',
      )
      return
    }

    const vehicle = {
      id: Date.now(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year,
      fuel: formData.fuel,
      mileage,
    }

    onAddVehicle(vehicle)
    resetForm()
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            MOJA GARAŽA
          </p>

          <h1>
            Moji motocikli
          </h1>

          <p className="page-description">
            Dodaj i upravljaj svojim motociklima
            na jednom mjestu.
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
        >
          {showForm
            ? 'Zatvori'
            : '+ Dodaj motocikl'}
        </button>
      </div>

      {showForm && (
        <form
          className="vehicle-form"
          onSubmit={handleSubmit}
        >
          <div className="form-header">
            <h2>
              Dodaj motocikl
            </h2>

            <p>
              Unesi osnovne podatke o svom
              motociklu.
            </p>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="brand">
                Marka
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="npr. Suzuki"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">
                Model
              </label>

              <input
                id="model"
                name="model"
                type="text"
                placeholder="npr. GSX-R 1300 Hayabusa"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Godina
              </label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder="npr. 2022"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel">
                Gorivo
              </label>

              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">
                  Odaberi gorivo
                </option>

                <option value="Benzin">
                  Benzin
                </option>

                <option value="Dizel">
                  Dizel
                </option>

                <option value="Električni">
                  Električni
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mileage">
                Kilometraža
              </label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                placeholder="npr. 25000"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="service-cancel-button"
              onClick={resetForm}
            >
              Odustani
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Spremi motocikl
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-icon">
            🏍️
          </div>

          <h2>
            Garaža je prazna
          </h2>

          <p>
            Dodaj svoj prvi motocikl kako bi
            započeo evidenciju.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + Dodaj prvi motocikl
          </button>
        </div>
      )}

      {vehicles.length > 0 && (
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <article
              className="vehicle-card"
              key={vehicle.id}
              onClick={() =>
                onSelectVehicle(vehicle)
              }
            >
              <div className="vehicle-card-icon">
                🏍️
              </div>

              <div className="vehicle-card-content">
                <p className="page-label">
                  {vehicle.year}
                </p>

                <h2>
                  {vehicle.brand}{' '}
                  {vehicle.model}
                </h2>

                <div className="vehicle-card-info">
                  <span>
                    Gorivo: {vehicle.fuel}
                  </span>

                  <span>
                    {Number(
                      vehicle.mileage,
                    ).toLocaleString(
                      'hr-HR',
                    )}{' '}
                    km
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Vozila
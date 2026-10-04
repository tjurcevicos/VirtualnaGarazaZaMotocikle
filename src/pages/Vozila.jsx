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

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newVehicle = {
      id: Date.now(),
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      fuel: formData.fuel,
      mileage: formData.mileage,
    }

    onAddVehicle(newVehicle)

    setFormData({
      brand: '',
      model: '',
      year: '',
      fuel: '',
      mileage: '',
    })

    setShowForm(false)
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            MOJA GARAŽA
          </p>

          <h1>Moji motocikli</h1>

          <p className="page-description">
            Dodaj i pregledaj svoje motocikle
            na jednom mjestu.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
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
              Dodaj novi motocikl
            </h2>

            <p>
              Unesi osnovne podatke o motociklu.
            </p>
          </div>

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
                placeholder="npr. GSXR-1300 Hayabusa"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Godina proizvodnje
              </label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder="npr. 2022"
                min="1900"
                max="2100"
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

                <option value="Hibrid">
                  Hibrid
                </option>

                <option value="Električno">
                  Električno
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
                placeholder="npr. 24500"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
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
            Nema dodanih motocikala
          </h2>

          <p>
            Dodaj svoj prvi motocikl kako bi
            mogao pratiti servise, gorivo,
            kilometražu i troškove.
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
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <article
              className="vehicle-card"
              key={vehicle.id}
            >
              <div className="vehicle-card-top">
                <div className="vehicle-icon">
                  🏍️
                </div>

                <span className="vehicle-year">
                  {vehicle.year}
                </span>
              </div>

              <h2>
                {vehicle.brand} {vehicle.model}
              </h2>

              <div className="vehicle-details">
                <div>
                  <span>
                    Gorivo
                  </span>

                  <strong>
                    {vehicle.fuel}
                  </strong>
                </div>

                <div>
                  <span>
                    Kilometraža
                  </span>

                  <strong>
                    {Number(
                      vehicle.mileage,
                    ).toLocaleString(
                      'hr-HR',
                    )}{' '}
                    km
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="vehicle-details-button"
                onClick={() =>
                  onSelectVehicle(vehicle)
                }
              >
                Pogledaj detalje
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Vozila
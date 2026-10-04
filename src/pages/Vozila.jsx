import { useState } from 'react'

function Vozila() {
  const [vehicles, setVehicles] = useState([])

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
      ...formData,
    }

    setVehicles((current) => [...current, newVehicle])

    setFormData({
      brand: '',
      model: '',
      year: '',
      fuel: '',
      mileage: '',
    })

    setShowForm(false)
  }

  function handleDelete(id) {
    setVehicles((current) =>
      current.filter((vehicle) => vehicle.id !== id),
    )
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">MOJA GARAŽA</p>

          <h1>Vozila</h1>

          <p className="page-description">
            Upravljaj svojim vozilima i prati njihove osnovne podatke.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? 'Zatvori' : '+ Dodaj vozilo'}
        </button>
      </div>

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div>
              <h2>Dodaj novo vozilo</h2>

              <p>
                Unesi osnovne podatke o svom vozilu.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="brand">Marka</label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="npr. SUZUKI"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model</label>

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
              <label htmlFor="year">Godina</label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder="npr. 2018"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel">Gorivo</label>

              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">Odaberi gorivo</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrid">Hibrid</option>
                <option value="Električno">Električno</option>
                <option value="Plin">Plin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Kilometraža</label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                placeholder="npr. 184250"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Spremi vozilo
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="empty-icon">🏍️</div>

          <h2>Nema dodanih vozila</h2>

          <p>
            Dodaj svoje prvo vozilo kako bi mogao pratiti
            servise, gorivo, kilometražu i troškove.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + Dodaj prvo vozilo
          </button>
        </div>
      )}

      {vehicles.length > 0 && (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <article className="vehicle-card" key={vehicle.id}>
              <div className="vehicle-card-top">
                <div className="vehicle-icon">🏍️</div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(vehicle.id)}
                >
                  Obriši
                </button>
              </div>

              <h2>
                {vehicle.brand} {vehicle.model}
              </h2>

              <div className="vehicle-details">
                <div>
                  <span>Godina</span>
                  <strong>{vehicle.year}</strong>
                </div>

                <div>
                  <span>Gorivo</span>
                  <strong>{vehicle.fuel}</strong>
                </div>

                <div>
                  <span>Kilometraža</span>
                  <strong>
                    {Number(vehicle.mileage).toLocaleString('hr-HR')} km
                  </strong>
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
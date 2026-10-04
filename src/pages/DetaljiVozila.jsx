function DetaljiVozila({
  vehicle,
  onBack,
  onDelete,
}) {
  return (
    <section className="page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Natrag na motocikle
      </button>

      <div className="vehicle-detail-header">
        <div className="vehicle-detail-icon">
          🏍️
        </div>

        <div>
          <p className="page-label">
            MOTOCIKL
          </p>

          <h1>
            {vehicle.brand} {vehicle.model}
          </h1>

          <p className="page-description">
            {vehicle.year} • {vehicle.fuel}
          </p>
        </div>
      </div>

      <div className="vehicle-detail-grid">
        <div className="detail-card">
          <span>
            Marka
          </span>

          <strong>
            {vehicle.brand}
          </strong>
        </div>

        <div className="detail-card">
          <span>
            Model
          </span>

          <strong>
            {vehicle.model}
          </strong>
        </div>

        <div className="detail-card">
          <span>
            Godina
          </span>

          <strong>
            {vehicle.year}
          </strong>
        </div>

        <div className="detail-card">
          <span>
            Gorivo
          </span>

          <strong>
            {vehicle.fuel}
          </strong>
        </div>

        <div className="detail-card">
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

      <div className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">
              ODRŽAVANJE
            </p>

            <h2>
              Servisna povijest
            </h2>
          </div>
        </div>

        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            🔧
          </div>

          <h3>
            Servisna povijest
          </h3>

          <p>
            Ovdje ćemo kasnije prikazivati
            sve servise ovog motocikla,
            uključujući datum, kilometražu,
            opis radova i cijenu.
          </p>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="page-label">
              TROŠKOVI
            </p>

            <h2>
              Troškovi motocikla
            </h2>
          </div>
        </div>

        <div className="coming-soon-card">
          <div className="coming-soon-icon">
            €
          </div>

          <h3>
            Troškovi
          </h3>

          <p>
            Ovdje ćemo kasnije pratiti
            troškove servisa, goriva,
            registracije, osiguranja i
            ostalih ulaganja.
          </p>
        </div>
      </div>

      <div className="detail-actions">
        <button
          type="button"
          className="danger-button"
          onClick={() =>
            onDelete(vehicle.id)
          }
        >
          Obriši motocikl
        </button>
      </div>
    </section>
  )
}

export default DetaljiVozila
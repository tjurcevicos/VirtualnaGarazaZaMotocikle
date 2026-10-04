function Home() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="page-label">VIRTUALNA GARAŽA</p>

          <h1>Dobrodošao u svoju garažu</h1>

          <p className="page-description">
            Pregled vozila, servisa, goriva i troškova na jednom mjestu.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="card-label">Vozila</span>
          <strong>0</strong>
          <p>Ukupno vozila</p>
        </div>

        <div className="dashboard-card">
          <span className="card-label">Servisi</span>
          <strong>0</strong>
          <p>Obavljenih servisa</p>
        </div>

        <div className="dashboard-card">
          <span className="card-label">Gorivo</span>
          <strong>0 L</strong>
          <p>Potrošeno goriva</p>
        </div>

        <div className="dashboard-card">
          <span className="card-label">Troškovi</span>
          <strong>0 €</strong>
          <p>Ukupni troškovi</p>
        </div>
      </div>

      <div className="welcome-card">
        <h2>Moja garaža</h2>

        <p>
          Kada dodaš svoje vozilo, ovdje ćemo prikazivati najvažnije
          informacije o njemu.
        </p>
      </div>
    </section>
  )
}

export default Home
function Vozila() {
  return (
    <section className="page">
      <div className="page-header">
        <p className="page-label">MOJA GARAŽA</p>

        <h1>Vozila</h1>

        <p className="page-description">
          Ovdje ćeš moći pregledavati i upravljati svojim vozilima.
        </p>
      </div>

      <div className="empty-state">
        <h2>Nema dodanih vozila</h2>

        <p>
          Kada budemo napravili funkcionalnost za dodavanje vozila,
          ovdje će se pojaviti tvoja vozila.
        </p>

        <button type="button" className="primary-button">
          Dodaj vozilo
        </button>
      </div>
    </section>
  )
}

export default Vozila
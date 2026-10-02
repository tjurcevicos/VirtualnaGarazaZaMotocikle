import './App.css'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">VG</span>
          <span>Virtualna Garaža</span>
        </div>

        <nav className="navigation">
          <a href="#" className="nav-item active">
            Početna
          </a>

          <a href="#" className="nav-item">
            Vozila
          </a>

          <a href="#" className="nav-item">
            Servisi
          </a>

          <a href="#" className="nav-item">
            Gorivo
          </a>

          <a href="#" className="nav-item">
            Troškovi
          </a>

          <a href="#" className="nav-item">
            Podsjetnici
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Dobrodošao u Virtualnu Garažu</h1>
        <p>Ovdje će se nalaziti tvoja garaža i pregled vozila.</p>
      </main>
    </div>
  )
}

export default App
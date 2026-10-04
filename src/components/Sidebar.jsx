function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    {
      id: 'home',
      label: 'Početna',
    },
    {
      id: 'vozila',
      label: 'Vozila',
    },
    {
      id: 'servisi',
      label: 'Servisi',
    },
    {
      id: 'gorivo',
      label: 'Gorivo',
    },
    {
      id: 'troskovi',
      label: 'Troškovi',
    },
    {
      id: 'podsjetnici',
      label: 'Podsjetnici',
    },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">VG</div>

        <div className="logo-text">
          <strong>Virtualna</strong>
          <span>Garaža</span>
        </div>
      </div>

      <nav className="navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${
              activePage === item.id ? 'active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
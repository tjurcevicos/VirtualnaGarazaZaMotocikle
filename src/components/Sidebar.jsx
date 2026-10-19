import { usePreferences } from '../i18n/Preferences'
const icons = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9" /><path d="M9 21v-7h6v7" /></>,
  vozila: <><circle cx="5.5" cy="17" r="3" /><circle cx="18.5" cy="17" r="3" /><path d="M8.5 17h5l-3-7h-4l-2 4" /><path d="m13.5 17 2-5h3l2 2" /><path d="M10 10 8 7h3" /></>,
  servisi: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18a2.1 2.1 0 0 0 3 3l5.3-5.3a5 5 0 0 0 6.4-6.4L14 13l-3-3z" /></>,
  gorivo: <><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" /><path d="M3 21h13M6 7h7v5H6z" /><path d="m15 9 3 3v6a2 2 0 0 0 4 0v-7l-3-4" /></>,
  troskovi: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  statistika: <><path d="M3 3v18h18" /><path d="M7 16v-4m5 4V7m5 9V5" /></>,
  kalendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18" /></>,
  putovanja: <><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></>,
  vrijeme: <><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/><path d="M5 18h14"/></>,
  pomoc: <><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-2.9 2.2-2.9 4" /><path d="M12 17h.01" /></>,
  postavke: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12" /></>,
  podsjetnici: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
}

function Sidebar({ activePage, onNavigate }) {
  const { t } = usePreferences()
  const menuItems = [
    { id: 'home', label: 'Početna' },
    { id: 'vozila', label: 'Vozila' },
    { id: 'servisi', label: 'Servisi' },
    { id: 'gorivo', label: 'Gorivo' },
    { id: 'troskovi', label: 'Troškovi' },
    { id: 'statistika', label: 'Statistika' },
    { id: 'podsjetnici', label: 'Podsjetnici' },
    { id: 'kalendar', label: 'Kalendar' },
    { id: 'putovanja', label: 'Putovanja' },
    { id: 'vrijeme', label: 'Vrijeme' },
    { id: 'pomoc', label: 'Pomoć' },
    { id: 'postavke', label: 'Postavke' },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon"><img src="/ikonamotogaraza.svg" alt="" aria-hidden="true" /></div>
        <div className="logo-text">
          <strong>{t("Virtualna")}</strong>
          <span>{t("Garaža")}</span>
        </div>
      </div>

      <nav className="navigation" aria-label={t('Glavna navigacija')}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[item.id]}
            </svg>
            <span className="nav-label">{t(item.label)}</span>
            <svg className="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

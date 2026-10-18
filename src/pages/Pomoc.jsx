import { useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import { helpSections } from '../data/helpContent'

export default function Pomoc({ onNavigate }) {
  const { t } = usePreferences()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [opened, setOpened] = useState([])
  const sections = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return helpSections.filter((section) => category === 'all' || section.title === category).map((section) => ({
      ...section,
      questions: section.questions.filter(({ q, a }) => !search || [t(section.title), t(q), t(a)].some((value) => value.toLocaleLowerCase().includes(search))),
    })).filter((section) => section.questions.length > 0)
  }, [query, category, t])

  return (
    <section className="page pomoc-page">
      <div className="pomoc-header">
        <p className="page-label">{t('Pomoć')}</p>
        <h1>{t('Centar za pomoć')}</h1>
        <p className="page-description">{t('Upute za korištenje Virtualne garaže.')}</p>
      </div>
      <div className="pomoc-toolbar">
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Pretraži upute i pitanja...')} aria-label={t('Pretraži upute i pitanja...')} />
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={t('Kategorija')}>
          <option value="all">{t('Sve kategorije')}</option>
          {helpSections.map((section) => <option key={section.title} value={section.title}>{t(section.title)}</option>)}
        </select>
      </div>
      {sections.length === 0 ? <div className="pomoc-empty">{t('Nema rezultata pretraživanja.')}</div> : sections.map((section) => (
        <section className="pomoc-section" key={section.title}>
          <div className="pomoc-section-heading">
            <h2>{t(section.title)}</h2>
            <button type="button" onClick={() => onNavigate(section.page)}>{t('Otvori stranicu')} <span aria-hidden="true">→</span></button>
          </div>
          <div className="pomoc-questions">
            {section.questions.map(({ q, a }) => {
              const isOpen = opened.includes(q)
              return <div className="pomoc-question" key={q}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpened((current) => isOpen ? current.filter((item) => item !== q) : [...current, q])}>
                  <span>{t(q)}</span><span className="pomoc-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p>{t(a)}</p>}
              </div>
            })}
          </div>
        </section>
      ))}
    </section>
  )
}

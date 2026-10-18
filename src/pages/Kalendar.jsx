import { useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import { buildCalendarEvents } from '../utils/calendarEvents'

const isoDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const mondayIndex = (date) => (date.getDay() + 6) % 7
const kinds = ['reminder', 'maintenance', 'registration', 'service', 'trip']
const kindLabels = { reminder: 'Podsjetnici', maintenance: 'Plan održavanja', registration: 'Registracija i osiguranje', service: 'Servisi', trip: 'Putovanja' }

export default function Kalendar({ vehicles, services, reminders, maintenancePlans, registrationRecords, trips, onNavigate }) {
  const { t, language } = usePreferences()
  const today = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(() => isoDay(today))
  const [vehicleId, setVehicleId] = useState('all')
  const [enabledKinds, setEnabledKinds] = useState(kinds)
  const events = useMemo(() => buildCalendarEvents({ vehicles, services, reminders, maintenancePlans, registrationRecords, trips }), [vehicles, services, reminders, maintenancePlans, registrationRecords, trips])
  const filtered = useMemo(() => events.filter((event) => (vehicleId === 'all' || event.vehicleId === vehicleId) && enabledKinds.includes(event.type)), [events, vehicleId, enabledKinds])
  const byDay = useMemo(() => {
    const result = new Map()
    for (const event of filtered) result.set(event.date, [...(result.get(event.date) || []), event])
    return result
  }, [filtered])
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const startOffset = mondayIndex(first)
  const cells = Array.from({ length: Math.ceil((startOffset + last.getDate()) / 7) * 7 }, (_, index) => {
    const date = new Date(month.getFullYear(), month.getMonth(), 1 + index - startOffset)
    return { date: isoDay(date), number: date.getDate(), inMonth: date.getMonth() === month.getMonth() }
  })
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(language, { weekday: 'short' }).format(new Date(2024, 0, 1 + index)))
  const monthLabel = new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(month)
  const chosen = byDay.get(selectedDay) || []
  const chosenLabel = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${selectedDay}T12:00:00`))
  const monthCount = filtered.filter((event) => event.date.slice(0, 7) === isoDay(month).slice(0, 7)).length
  const moveMonth = (step) => {
    const next = new Date(month.getFullYear(), month.getMonth() + step, 1)
    setMonth(next)
    setSelectedDay(isoDay(next))
  }
  const jumpToday = () => {
    const current = new Date()
    setMonth(new Date(current.getFullYear(), current.getMonth(), 1))
    setSelectedDay(isoDay(current))
  }
  const toggleKind = (kind) => setEnabledKinds((current) => current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind])

  return <section className="calendar-page">
    <div className="calendar-header"><div><p className="page-label">{t('PREGLED GARAŽE')}</p><h1>{t('Kalendar')}</h1><p className="page-description">{t('Svi važni datumi tvoje garaže na jednom mjestu.')}</p></div><div className="calendar-actions"><button type="button" onClick={jumpToday}>{t('Danas')}</button><button type="button" onClick={() => moveMonth(-1)} aria-label={t('Prethodni mjesec')}>‹</button><button type="button" onClick={() => moveMonth(1)} aria-label={t('Sljedeći mjesec')}>›</button></div></div>
    <div className="calendar-toolbar"><label>{t('Motocikl')}<select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}><option value="all">{t('Svi motocikli')}</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={String(vehicle.id)}>{vehicle.brand} {vehicle.model}</option>)}</select></label><div className="calendar-kind-filters" aria-label={t('Vrste događaja')}>{kinds.map((kind) => <label key={kind} className={`calendar-kind ${kind}`}><input type="checkbox" checked={enabledKinds.includes(kind)} onChange={() => toggleKind(kind)} /><span>{t(kindLabels[kind])}</span></label>)}</div></div>
    <div className="calendar-layout"><div className="calendar-board"><div className="calendar-month"><h2>{monthLabel}</h2><span>{monthCount} {t('događaja')}</span></div><div className="calendar-grid">{weekdays.map((day, index) => <div className="calendar-weekday" key={index}>{day}</div>)}{cells.map((cell) => {const dayEvents = byDay.get(cell.date) || [];return <button key={cell.date} type="button" className={`calendar-day${cell.inMonth ? '' : ' outside'}${selectedDay === cell.date ? ' selected' : ''}${cell.date === isoDay(today) ? ' today' : ''}`} onClick={() => {setSelectedDay(cell.date);if (!cell.inMonth) {const [year,mon] = cell.date.split('-').map(Number);setMonth(new Date(year,mon-1,1))}}} aria-label={`${cell.date}: ${dayEvents.length} ${t('događaja')}`} aria-pressed={selectedDay === cell.date}><span className="calendar-day-number">{cell.number}</span><span className="calendar-dots">{dayEvents.slice(0, 4).map((event) => <i className={`calendar-dot ${event.type}`} key={event.id} />)}{dayEvents.length > 4 && <small>+{dayEvents.length - 4}</small>}</span></button>})}</div></div><aside className="calendar-agenda"><h2>{chosenLabel}</h2><p className="calendar-agenda-count">{chosen.length} {t('događaja')}</p>{chosen.length ? <div className="calendar-event-list">{chosen.map((event) => <article key={event.id} className={`calendar-event ${event.type}`}><span className="calendar-event-kind">{t(kindLabels[event.type])}{event.completed ? ` · ${t('Završeno')}` : ''}</span><strong>{t(event.title)}</strong>{event.vehicleName && <span>{event.vehicleName}</span>}<button type="button" onClick={() => onNavigate(event.page)}>{t('Otvori povezanu stranicu')} →</button></article>)}</div> : <p className="calendar-empty">{t('Nema događaja za odabrani dan.')}</p>}</aside></div>
    <p className="calendar-note">{t('Kalendar se automatski ažurira iz Podsjetnika, Servisa, Plana održavanja te Registracije i osiguranja. Planovi samo po kilometraži nemaju datum i nisu prikazani.')}</p>
  </section>
}

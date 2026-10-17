import { useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import '../styles/PlanOdrzavanja.css'

const types = ['Zamjena ulja', 'Filteri', 'Kočnice', 'Gume', 'Lanac', 'Ostalo']
const initial = { vehicleId: '', type: 'Zamjena ulja', title: '', lastMileage: '', lastDate: '', intervalKm: '', intervalMonths: '' }
const dateAfterMonths = (value, months) => {
  if (!value || !months) return null
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return null
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + Number(months))
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, end))
  return d.toISOString().slice(0, 10)
}

export default function PlanOdrzavanja({ vehicles, services, plans, onChange, reminders, onAddReminder }) {
  const { t } = usePreferences()
  const [form, setForm] = useState(initial)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const rows = useMemo(() => plans.filter((plan) => vehicleFilter === 'all' || String(plan.vehicleId) === vehicleFilter).map((plan) => {
    const vehicle = vehicles.find((v) => String(v.id) === String(plan.vehicleId))
    const currentKm = Number(vehicle?.mileage ?? 0)
    const dueKm = plan.intervalKm ? Number(plan.lastMileage) + Number(plan.intervalKm) : null
    const remaining = dueKm === null ? null : dueKm - currentKm
    const dueDate = dateAfterMonths(plan.lastDate, plan.intervalMonths)
    const days = dueDate ? Math.ceil((new Date(`${dueDate}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000) : null
    const overdue = (remaining !== null && remaining <= 0) || (days !== null && days <= 0)
    const soon = !overdue && ((remaining !== null && remaining <= 500) || (days !== null && days <= 30))
    return { ...plan, vehicle, dueKm, remaining, dueDate, days, status: overdue ? 'late' : soon ? 'soon' : 'ok' }
  }), [plans, vehicles, vehicleFilter, today])

  const update = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setError('') }
  const reset = () => { setForm(initial); setEditing(null); setError(''); setShowForm(false) }
  const save = (event) => {
    event.preventDefault()
    const km = form.intervalKm === '' ? null : Number(form.intervalKm)
    const months = form.intervalMonths === '' ? null : Number(form.intervalMonths)
    if (!form.vehicleId || !form.title.trim() || !form.lastDate || form.lastMileage === '' || Number(form.lastMileage) < 0 || (!km && !months) || (km !== null && (!Number.isFinite(km) || km <= 0)) || (months !== null && (!Number.isInteger(months) || months <= 0))) {
      setError(t('Unesi ispravne podatke i barem jedan interval održavanja.'))
      return
    }
    const item = { ...form, id: editing ?? Date.now(), vehicleId: Number(form.vehicleId), title: form.title.trim(), lastMileage: Number(form.lastMileage), intervalKm: km, intervalMonths: months }
    onChange((current) => editing === null ? [...current, item] : current.map((p) => p.id === editing ? item : p))
    reset()
  }
  const edit = (plan) => {
    setForm({ vehicleId: String(plan.vehicleId), type: plan.type, title: plan.title, lastMileage: String(plan.lastMileage), lastDate: plan.lastDate, intervalKm: plan.intervalKm ?? '', intervalMonths: plan.intervalMonths ?? '' })
    setEditing(plan.id); setShowForm(true); setError('')
  }
  const remove = (id) => { if (window.confirm(t('Obrisati plan održavanja?'))) onChange((current) => current.filter((p) => p.id !== id)) }
  const addReminder = (row) => {
    if (!row.vehicle || !onAddReminder) return
    if (reminders.some((r) => r.maintenancePlanId === row.id)) return
    onAddReminder({ id: Date.now(), vehicleId: row.vehicleId, type: 'Servis', title: row.title, description: `${t('Planirano održavanje')}: ${row.title}`, date: row.dueDate ?? today, mileage: row.dueKm ?? '', completed: false, maintenancePlanId: row.id })
  }
  return <section className="maintenance-panel">
    <div className="maintenance-head"><div><h2>{t('Plan održavanja')}</h2><p>{t('Prati sljedeće servise prema kilometraži i datumu.')}</p></div><button className="primary-button" type="button" onClick={() => showForm ? reset() : setShowForm(true)}>{showForm ? t('Zatvori') : t('+ Dodaj plan')}</button></div>
    {showForm && <form className="maintenance-form" onSubmit={save}>
      <div className="maintenance-fields">
        <label>{t('Motocikl')}<select value={form.vehicleId} onChange={(e) => update('vehicleId', e.target.value)}><option value="">{t('Odaberi motocikl')}</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.model}</option>)}</select></label>
        <label>{t('Vrsta održavanja')}<select value={form.type} onChange={(e) => update('type', e.target.value)}>{types.map((type) => <option key={type} value={type}>{t(type)}</option>)}</select></label>
        <label>{t('Naziv zahvata')}<input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder={t('npr. Zamjena ulja i filtera')} /></label>
        <label>{t('Zadnja kilometraža')}<input type="number" min="0" value={form.lastMileage} onChange={(e) => update('lastMileage', e.target.value)} /></label>
        <label>{t('Datum zadnjeg održavanja')}<input type="date" value={form.lastDate} onChange={(e) => update('lastDate', e.target.value)} /></label>
        <label>{t('Interval (km)')}<input type="number" min="1" value={form.intervalKm} onChange={(e) => update('intervalKm', e.target.value)} /></label>
        <label>{t('Interval (mjeseci)')}<input type="number" min="1" step="1" value={form.intervalMonths} onChange={(e) => update('intervalMonths', e.target.value)} /></label>
      </div>{error && <p className="maintenance-error">{error}</p>}
      <div className="maintenance-actions"><button className="primary-button" type="submit">{editing === null ? t('Spremi plan') : t('Spremi promjene')}</button><button type="button" onClick={reset}>{t('Odustani')}</button></div>
    </form>}
    <div className="maintenance-toolbar"><label>{t('Filtriraj po motociklu')}<select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}><option value="all">{t('Svi motocikli')}</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.model}</option>)}</select></label><span>{rows.length} {t('planova')}</span></div>
    {rows.length === 0 ? <p className="maintenance-empty">{t('Nema evidentiranih planova održavanja.')}</p> : <div className="maintenance-list">{rows.map((row) => <article key={row.id} className="maintenance-item"><div className="maintenance-item-top"><div><strong>{row.title}</strong><span>{row.vehicle ? `${row.vehicle.brand} ${row.vehicle.model}` : t('Nepoznat motocikl')} · {t(row.type)}</span></div><span className={`maintenance-status maintenance-${row.status}`}>{t(row.status === 'late' ? 'Prekoračeno' : row.status === 'soon' ? 'Uskoro dospijeva' : 'Uredno')}</span></div><div className="maintenance-metrics"><span>{t('Sljedeća kilometraža')}: <b>{row.dueKm === null ? '—' : `${row.dueKm.toLocaleString('hr-HR')} km`}</b></span><span>{t('Preostalo kilometara')}: <b>{row.remaining === null ? '—' : `${row.remaining.toLocaleString('hr-HR')} km`}</b></span><span>{t('Sljedeći datum')}: <b>{row.dueDate ?? '—'}</b></span></div><div className="maintenance-actions"><button type="button" onClick={() => edit(row)}>{t('Uredi')}</button><button type="button" onClick={() => remove(row.id)}>{t('Obriši')}</button><button type="button" disabled={reminders.some((r) => r.maintenancePlanId === row.id)} onClick={() => addReminder(row)}>{reminders.some((r) => r.maintenancePlanId === row.id) ? t('Podsjetnik dodan') : t('Dodaj podsjetnik')}</button></div></article>)}</div>}
  </section>
}

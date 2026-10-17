import { useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import '../styles/RegistracijaOsiguranje.css'

const empty = { type: 'registration', startDate: '', expiryDate: '', company: '', policyNumber: '', amount: '', notes: '' }
const dayDiff = (date) => Math.ceil((new Date(`${date}T12:00:00`) - new Date(`${new Date().toISOString().slice(0, 10)}T12:00:00`)) / 86400000)

export default function RegistracijaOsiguranje({ vehicle, records, onChange, reminders, onAddReminder }) {
  const { t, language } = usePreferences()
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const rows = records.filter((record) => String(record.vehicleId) === String(vehicle.id)).sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
  const labels = { registration: 'Registracija', inspection: 'Tehnički pregled', insurance: 'Osiguranje' }
  const formatDate = (date) => date ? new Intl.DateTimeFormat(language === 'hr' ? 'hr-HR' : language, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${date}T12:00:00`)) : '—'
  const update = (name, value) => { setForm((current) => ({ ...current, [name]: value })); setError('') }
  const reset = () => { setForm(empty); setEditingId(null); setShowForm(false); setError('') }
  const save = (event) => {
    event.preventDefault()
    const amount = form.amount === '' ? null : Number(form.amount)
    if (!form.expiryDate || (form.startDate && form.startDate > form.expiryDate) || (amount !== null && (!Number.isFinite(amount) || amount < 0))) {
      setError(t('Provjeri datum isteka, početni datum i iznos.'))
      return
    }
    const record = { ...form, id: editingId ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`), vehicleId: vehicle.id, amount, company: form.company.trim(), policyNumber: form.policyNumber.trim(), notes: form.notes.trim() }
    onChange((current) => editingId === null ? [...current, record] : current.map((item) => item.id === editingId ? record : item))
    reset()
  }
  const edit = (record) => { setForm({ type: record.type, startDate: record.startDate ?? '', expiryDate: record.expiryDate, company: record.company ?? '', policyNumber: record.policyNumber ?? '', amount: record.amount ?? '', notes: record.notes ?? '' }); setEditingId(record.id); setShowForm(true); setError('') }
  const remove = (id) => { if (window.confirm(t('Obrisati ovaj zapis?'))) onChange((current) => current.filter((item) => item.id !== id)) }
  const addReminder = (record) => {
    if (reminders.some((reminder) => String(reminder.registrationRecordId) === String(record.id))) return
    onAddReminder({ id: Date.now(), vehicleId: vehicle.id, type: 'Registracija', title: `${t('Istječe')}: ${t(labels[record.type])}`, description: [record.company, record.policyNumber].filter(Boolean).join(' · '), date: record.expiryDate, mileage: '', completed: false, registrationRecordId: record.id })
  }
  return <section className="detail-section registration-section">
    <div className="detail-section-header registration-heading"><div><p className="page-label">{t('DOKUMENTI')}</p><h2>{t('Registracija i osiguranje')}</h2><p className="page-description">{t('Prati rokove registracije, tehničkog pregleda i osiguranja.')}</p></div><button className="primary-button" type="button" onClick={() => showForm ? reset() : setShowForm(true)}>{showForm ? t('Zatvori') : t('+ Dodaj zapis')}</button></div>
    {showForm && <form className="registration-form" onSubmit={save}>
      <div className="registration-fields">
        <label>{t('Vrsta zapisa')}<select value={form.type} onChange={(event) => update('type', event.target.value)}>{Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{t(label)}</option>)}</select></label>
        <label>{t('Datum početka')}<input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} /></label>
        <label>{t('Datum isteka')}<input type="date" required value={form.expiryDate} onChange={(event) => update('expiryDate', event.target.value)} /></label>
        <label>{t('Osiguravajuća kuća / ustanova')}<input value={form.company} onChange={(event) => update('company', event.target.value)} /></label>
        <label>{t('Broj police / dokumenta')}<input value={form.policyNumber} onChange={(event) => update('policyNumber', event.target.value)} /></label>
        <label>{t('Trošak (€)')}<input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => update('amount', event.target.value)} /></label>
        <label className="registration-notes">{t('Napomena')}<textarea rows="2" value={form.notes} onChange={(event) => update('notes', event.target.value)} /></label>
      </div>
      {error && <p className="registration-error" role="alert">{error}</p>}
      <div className="registration-actions"><button className="primary-button" type="submit">{editingId === null ? t('Spremi zapis') : t('Spremi promjene')}</button><button type="button" onClick={reset}>{t('Odustani')}</button></div>
    </form>}
    {rows.length === 0 ? <p className="registration-empty">{t('Nema spremljenih podataka o registraciji i osiguranju.')}</p> : <div className="registration-list">{rows.map((record) => {
      const days = dayDiff(record.expiryDate)
      const status = days < 0 ? 'expired' : days <= 30 ? 'soon' : 'valid'
      const reminderExists = reminders.some((reminder) => String(reminder.registrationRecordId) === String(record.id))
      return <article className="registration-card" key={record.id}>
        <div className="registration-card-top"><strong>{t(labels[record.type] ?? labels.registration)}</strong><span className={`registration-status registration-${status}`}>{t(status === 'expired' ? 'Isteklo' : status === 'soon' ? 'Uskoro istječe' : 'Važeće')}</span></div>
        <div className="registration-info"><span>{t('Datum isteka')}: <b>{formatDate(record.expiryDate)}</b></span><span>{t('Preostalo dana')}: <b>{days < 0 ? `${Math.abs(days)} ${t('dana nakon isteka')}` : `${days} ${t('dana')}`}</b></span>{record.startDate && <span>{t('Datum početka')}: <b>{formatDate(record.startDate)}</b></span>}{record.company && <span>{t('Osiguravajuća kuća / ustanova')}: <b>{record.company}</b></span>}{record.policyNumber && <span>{t('Broj police / dokumenta')}: <b>{record.policyNumber}</b></span>}{record.amount !== null && record.amount !== undefined && <span>{t('Trošak (€)')}: <b>{Number(record.amount).toLocaleString('hr-HR', { style: 'currency', currency: 'EUR' })}</b></span>}</div>
        {record.notes && <p className="registration-note">{record.notes}</p>}
        <div className="registration-actions"><button type="button" onClick={() => edit(record)}>{t('Uredi')}</button><button type="button" onClick={() => remove(record.id)}>{t('Obriši')}</button><button type="button" disabled={reminderExists} onClick={() => addReminder(record)}>{reminderExists ? t('Podsjetnik dodan') : t('Dodaj podsjetnik')}</button></div>
      </article>
    })}</div>}
  </section>
}

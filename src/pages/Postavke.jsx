import { useState } from 'react'
import { createBackup, downloadBackup, restoreBackup, validateBackup } from '../utils/backupStorage'
import '../styles/Postavke.css'

function Postavke({ userId }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)

  async function handleExport() {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      downloadBackup(await createBackup(userId))
      setMessage('Sigurnosna kopija uspješno je preuzeta.')
    } catch (cause) {
      setError(cause.message || 'Izvoz nije uspio.')
    } finally {
      setBusy(false)
    }
  }

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    setMessage('')
    setPending(null)
    try {
      if (file.size > 100 * 1024 * 1024) throw new Error('Datoteka je prevelika (najviše 100 MB).')
      const backup = validateBackup(JSON.parse(await file.text()))
      setPending(backup)
    } catch (cause) {
      setError(cause.message || 'Datoteka nije ispravna.')
    }
  }

  async function handleRestore() {
    if (!pending) return
    setBusy(true)
    setError('')
    try {
      await restoreBackup(userId, pending)
      window.location.reload()
    } catch (cause) {
      setError(cause.message || 'Vraćanje podataka nije uspjelo.')
      setBusy(false)
    }
  }

  return (
    <div className="postavke-page">
      <div className="postavke-heading">
        <div><span className="postavke-eyebrow">VIRTUALNA GARAŽA</span><h1>Postavke</h1><p>Upravljanje sigurnosnim kopijama podataka garaže.</p></div>
      </div>
      <div className="postavke-grid">
        <section className="postavke-card">
          <div className="postavke-card-icon">↓</div>
          <h2>Izvoz sigurnosne kopije</h2>
          <p>Preuzmi motocikle, servise, gorivo, troškove, podsjetnike i fotografije u jednoj JSON datoteci.</p>
          <button className="postavke-primary" type="button" disabled={busy} onClick={handleExport}>{busy ? 'Pričekaj...' : 'Preuzmi sigurnosnu kopiju'}</button>
        </section>
        <section className="postavke-card">
          <div className="postavke-card-icon">↑</div>
          <h2>Vraćanje podataka</h2>
          <p>Odaberi prethodno spremljenu JSON datoteku. Prije zamjene podataka prikazat će se potvrda.</p>
          <label className={`postavke-file ${busy ? 'postavke-disabled' : ''}`}>
            Odaberi JSON datoteku
            <input type="file" accept=".json,application/json" disabled={busy} onChange={handleFile} />
          </label>
        </section>
      </div>
      {pending && (
        <section className="postavke-confirm">
          <h2>Potvrdi vraćanje sigurnosne kopije</h2>
          <p>Sigurnosna kopija od {pending.exportedAt ? new Date(pending.exportedAt).toLocaleString('hr-HR') : 'nepoznatog datuma'} sadrži {pending.data.vehicles.length} motocikala, {pending.data.services.length} servisa, {pending.data.fuelRecords.length} točenja, {pending.data.expenses.length} troškova i {pending.data.reminders.length} podsjetnika.</p>
          <p className="postavke-warning">Postojeći podaci ovog korisnika bit će zamijenjeni. Prije nastavka preporučujemo izvoz trenutačnih podataka.</p>
          <div className="postavke-actions"><button type="button" className="postavke-secondary" disabled={busy} onClick={() => setPending(null)}>Odustani</button><button type="button" className="postavke-danger" disabled={busy} onClick={handleRestore}>{busy ? 'Vraćanje...' : 'Potvrdi i zamijeni podatke'}</button></div>
        </section>
      )}
      {message && <p className="postavke-message" role="status">{message}</p>}
      {error && <p className="postavke-error" role="alert">{error}</p>}
      <p className="postavke-footnote">Sigurnosna kopija sprema se na tvoje računalo. Ne uključuje korisničke lozinke ni podatke drugih korisnika.</p>
    </div>
  )
}

export default Postavke

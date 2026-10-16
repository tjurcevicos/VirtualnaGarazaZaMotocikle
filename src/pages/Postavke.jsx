import { usePreferences } from '../i18n/Preferences'
import { useState } from 'react'
import { createBackup, downloadBackup, restoreBackup, validateBackup } from '../utils/backupStorage'
import '../styles/Postavke.css'

function Postavke({ userId }) {
  const { theme, setTheme, language, setLanguage, t } = usePreferences()
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
        <div><span className="postavke-eyebrow">VIRTUALNA GARAŽA</span><h1>{t('Postavke')}</h1><p>Upravljanje sigurnosnim kopijama podataka garaže.</p></div>
      </div>
      <section className="postavke-personalization">
        <div className="postavke-personalization-header"><h2>{t('Izgled aplikacije')}</h2><p>Odaberi izgled cijele garaže. Promjene se automatski spremaju.</p></div>
        <div className="postavke-theme-grid">
          {[
            ['dark','Tamna'], ['light','Svijetla'], ['blue','Plava'],
            ['graphite','Grafitna'], ['emerald','Smaragdna'], ['purple','Ljubičasta'],
          ].map(([id, label]) => (
            <button type="button" key={id} className={`postavke-theme-choice ${theme === id ? 'selected' : ''}`} onClick={() => setTheme(id)} aria-pressed={theme === id}>
              <span className={`postavke-theme-preview preview-${id}`}><i/><i/><i/></span>
              <span>{t(label)}</span><span className="postavke-theme-check">{theme === id ? '✓' : ''}</span>
            </button>
          ))}
        </div>
        <div className="postavke-language-row">
          <label htmlFor="garage-language">{t('Jezik aplikacije')}</label>
          <select id="garage-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="hr">🇭🇷 Hrvatski</option><option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option><option value="it">🇮🇹 Italiano</option>
            <option value="sl">🇸🇮 Slovenščina</option>
          </select>
        </div>
      </section>
      <div className="postavke-grid">
        <section className="postavke-card">
          <div className="postavke-card-icon">↓</div>
          <h2>{t('Izvoz sigurnosne kopije')}</h2>
          <p>Preuzmi motocikle, servise, gorivo, troškove, podsjetnike i fotografije u jednoj JSON datoteci.</p>
          <button className="postavke-primary" type="button" disabled={busy} onClick={handleExport}>{busy ? 'Pričekaj...' : 'Preuzmi sigurnosnu kopiju'}</button>
        </section>
        <section className="postavke-card">
          <div className="postavke-card-icon">↑</div>
          <h2>{t('Vraćanje podataka')}</h2>
          <p>Odaberi prethodno spremljenu JSON datoteku. Prije zamjene podataka prikazat će se potvrda.</p>
          <label className={`postavke-file ${busy ? 'postavke-disabled' : ''}`}>
            Odaberi JSON datoteku
            <input type="file" accept=".json,application/json" disabled={busy} onChange={handleFile} />
          </label>
        </section>
      </div>
      {pending && (
        <section className="postavke-confirm">
          <h2>{t('Potvrdi vraćanje sigurnosne kopije')}</h2>
          <p>Sigurnosna kopija od {pending.exportedAt ? new Date(pending.exportedAt).toLocaleString('hr-HR') : 'nepoznatog datuma'} sadrži {pending.data.vehicles.length} motocikala, {pending.data.services.length} servisa, {pending.data.fuelRecords.length} točenja, {pending.data.expenses.length} troškova i {pending.data.reminders.length} podsjetnika.</p>
          <p className="postavke-warning">Postojeći podaci ovog korisnika bit će zamijenjeni. Prije nastavka preporučujemo izvoz trenutačnih podataka.</p>
          <div className="postavke-actions"><button type="button" className="postavke-secondary" disabled={busy} onClick={() => setPending(null)}>{t('Odustani')}</button><button type="button" className="postavke-danger" disabled={busy} onClick={handleRestore}>{busy ? 'Vraćanje...' : 'Potvrdi i zamijeni podatke'}</button></div>
        </section>
      )}
      {message && <p className="postavke-message" role="status">{message}</p>}
      {error && <p className="postavke-error" role="alert">{error}</p>}
      <p className="postavke-footnote">Sigurnosna kopija sprema se na tvoje računalo. Ne uključuje korisničke lozinke ni podatke drugih korisnika.</p>
    </div>
  )
}

export default Postavke

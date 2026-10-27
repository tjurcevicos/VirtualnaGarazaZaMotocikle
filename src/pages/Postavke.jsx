import { APP_VERSION } from '../config/appInfo'
import { usePreferences } from '../i18n/Preferences'
import { useState } from 'react'
import { createBackup, downloadBackup, restoreBackup, validateBackup } from '../utils/backupStorage'
import '../styles/Postavke.css'

function Postavke({ userId }) {
  const { theme, setTheme, language, setLanguage, t } = usePreferences()
  const [showMotoTips, setShowMotoTips] = useState(() => localStorage.getItem('vg-show-moto-tips') !== 'false')
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
      setMessage(t('Sigurnosna kopija uspješno je preuzeta.'))
    } catch (cause) {
      setError(t(cause.message || 'Izvoz nije uspio.'))
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
      if (file.size > 100 * 1024 * 1024) throw new Error(t('Datoteka je prevelika (najviše 100 MB).'))
      const backup = validateBackup(JSON.parse(await file.text()))
      setPending(backup)
    } catch (cause) {
      setError(t(cause.message || 'Datoteka nije ispravna.'))
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
      setError(t(cause.message || 'Vraćanje podataka nije uspjelo.'))
      setBusy(false)
    }
  }

  return (
    <div className="postavke-page">
      <div className="postavke-heading">
        <div><span className="postavke-eyebrow">{t('VIRTUALNA GARAŽA')}</span><h1>{t('Postavke')}</h1><p>{t('Upravljanje sigurnosnim kopijama podataka garaže.')}</p></div>
      </div>
      <section className="postavke-personalization">
        <div className="postavke-personalization-header"><h2>{t('Izgled aplikacije')}</h2><p>{t('Odaberi izgled cijele garaže. Promjene se automatski spremaju.')}</p></div>
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
        <div className="postavke-subsection">
          <div className="postavke-subsection-heading">
            <h2>{t('Moto savjeti')}</h2>
            <p>{t('Upravljaj prikazom savjeta na početnoj stranici.')}</p>
          </div>
          <label className="postavke-tips-toggle" htmlFor="show-moto-tips">
            <span><strong>{t('Prikazuj moto savjete na naslovnoj stranici')}</strong><small>{t('Savjeti se automatski izmjenjuju tijekom korištenja aplikacije.')}</small></span>
            <input id="show-moto-tips" type="checkbox" checked={showMotoTips} onChange={(event) => { const enabled = event.target.checked; setShowMotoTips(enabled); localStorage.setItem('vg-show-moto-tips', String(enabled)); window.dispatchEvent(new Event('garage-tips-visibility')) }} />
          </label>
        </div>
        <div className="postavke-subsection postavke-language-section">
          <div className="postavke-subsection-heading"><h2>{t('Jezik aplikacije')}</h2><p>{t('Odaberi jezik korisničkog sučelja.')}</p></div>
          <label className="postavke-language-label" htmlFor="garage-language">{t('Jezik')}</label>
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
          <p>{t('Preuzmi motocikle, servise, gorivo, troškove, podsjetnike i fotografije u jednoj JSON datoteci.')}</p>
          <button className="postavke-primary" type="button" disabled={busy} onClick={handleExport}>{busy ? t('Pričekaj...') : t('Preuzmi sigurnosnu kopiju')}</button>
        </section>
        <section className="postavke-card">
          <div className="postavke-card-icon">↑</div>
          <h2>{t('Vraćanje podataka')}</h2>
          <p>{t('Odaberi prethodno spremljenu JSON datoteku. Prije zamjene podataka prikazat će se potvrda.')}</p>
          <label className={`postavke-file ${busy ? 'postavke-disabled' : ''}`}>
            {t("Odaberi JSON datoteku")}
            <input type="file" accept=".json,application/json" disabled={busy} onChange={handleFile} />
          </label>
        </section>
      </div>
      {pending && (
        <section className="postavke-confirm">
          <h2>{t('Potvrdi vraćanje sigurnosne kopije')}</h2>
          <p>{t("Sigurnosna kopija od")} {pending.exportedAt ? new Date(pending.exportedAt).toLocaleString('hr-HR') : t("nepoznatog datuma")} {t("sadrži")} {pending.data.vehicles.length} {t("motocikala,")} {pending.data.services.length} {t("servisa,")} {pending.data.fuelRecords.length} {t("točenja,")} {pending.data.expenses.length} {t("troškova i")} {pending.data.reminders.length} {t("podsjetnika.")}</p>
          <p className="postavke-warning">{t('Postojeći podaci ovog korisnika bit će zamijenjeni. Prije nastavka preporučujemo izvoz trenutačnih podataka.')}</p>
          <div className="postavke-actions"><button type="button" className="postavke-secondary" disabled={busy} onClick={() => setPending(null)}>{t('Odustani')}</button><button type="button" className="postavke-danger" disabled={busy} onClick={handleRestore}>{busy ? t('Vraćanje...') : t('Potvrdi i zamijeni podatke')}</button></div>
        </section>
      )}
      {message && <p className="postavke-message" role="status">{message}</p>}
      {error && <p className="postavke-error" role="alert">{error}</p>}
      <section className="postavke-about" aria-labelledby="postavke-about-title">
        <h2 id="postavke-about-title">{t('O aplikaciji')}</h2>
        <p>{t('Virtualna garaža za motocikle')}</p>
        <div className="postavke-version-row"><span>{t('Verzija aplikacije')}</span><strong>v{APP_VERSION}</strong></div>
      </section>
      <p className="postavke-footnote">{t('Sigurnosna kopija sprema se na tvoje računalo. Ne uključuje korisničke lozinke ni podatke drugih korisnika.')}</p>
    </div>
  )
}

export default Postavke

import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import { fetchGarageTips } from '../services/garageMockApi'
import '../styles/GarageApiTips.scss'

const settingKey = 'vg-show-moto-tips'

function pickNext(count, previous) {
  if (count < 2) return 0
  const candidate = Math.floor(Math.random() * (count - 1))
  return candidate >= previous ? candidate + 1 : candidate
}

export default function GarageApiTips() {
  const { t, language } = usePreferences()
  const [visible, setVisible] = useState(() => localStorage.getItem(settingKey) !== 'false')
  const [tips, setTips] = useState([])
  const [status, setStatus] = useState('loading')
  const [index, setIndex] = useState(0)
  const [requestId, setRequestId] = useState(0)
  const [fading, setFading] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const update = () => setVisible(localStorage.getItem(settingKey) !== 'false')
    window.addEventListener('garage-tips-visibility', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('garage-tips-visibility', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    const controller = new AbortController()
    fetchGarageTips({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return
        setTips(result)
        setIndex(Math.floor(Math.random() * result.length))
        setStatus('success')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error')
      })
    return () => controller.abort()
  }, [requestId, visible])

  useEffect(() => {
    if (!visible || status !== 'success' || tips.length < 2) return undefined
    const interval = window.setInterval(() => {
      setFading(true)
      timeoutRef.current = window.setTimeout(() => {
        setIndex((previous) => pickNext(tips.length, previous))
        setFading(false)
      }, 180)
    }, 30000)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeoutRef.current)
    }
  }, [visible, status, tips.length])

  function close() {
    localStorage.setItem(settingKey, 'false')
    setVisible(false)
    window.dispatchEvent(new Event('garage-tips-visibility'))
  }

  if (!visible) return null
  const current = tips[index]
  return (
    <section className="garage-api-tips" aria-labelledby="garage-api-tips-title" aria-busy={status === 'loading'}>
      <div className="garage-api-tips-heading">
        <h2 id="garage-api-tips-title">{t('Iz garaže')}</h2>
        <div className="garage-api-tips-actions">
          <span className="garage-api-tips-tag">{t('Moto savjet')}</span>
          <button type="button" className="garage-api-tips-close" onClick={close} aria-label={t('Sakrij moto savjete')} title={t('Sakrij moto savjete')}>×</button>
        </div>
      </div>
      {status === 'loading' && <p role="status" className="garage-api-tips-message">{t('Dohvaćanje podataka...')}</p>}
      {status === 'error' && <div role="alert" className="garage-api-tips-message"><p>{t('Dohvat podataka nije uspio.')}</p><button type="button" className="primary-button" onClick={() => { setStatus('loading'); setRequestId((n) => n + 1) }}>{t('Pokušaj ponovno')}</button></div>}
      {status === 'success' && current && (
        <div className={`garage-api-tips-content ${fading ? 'is-changing' : ''}`} lang={language}>
          <strong>{t(current.title)}</strong>
          <p>{t(current.description)}</p>
        </div>
      )}
      {status === 'success' && <div className="garage-api-tips-footer"><span>{t('Novi savjet svakih 30 sekundi')}</span><span>{index + 1} / {tips.length}</span></div>}
    </section>
  )
}

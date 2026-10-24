import { useEffect, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import { fetchGarageTips } from '../services/garageMockApi'
import '../styles/GarageApiTips.scss'

export default function GarageApiTips() {
  const { t } = usePreferences()
  const [tips, setTips] = useState([])
  const [status, setStatus] = useState('loading')
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchGarageTips({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return
        setTips(result)
        setStatus('success')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error')
      })
    return () => controller.abort()
  }, [requestId])

  function retry() {
    setStatus('loading')
    setRequestId((current) => current + 1)
  }

  return (
    <section className="garage-api-tips" aria-labelledby="garage-api-tips-title" aria-busy={status === 'loading'}>
      <div className="garage-api-tips-heading">
        <div>
          <h2 id="garage-api-tips-title">{t('Savjeti za održavanje')}</h2>
        </div>
        {status === 'success' && <span className="garage-api-tips-status" role="status">{t('Podaci uspješno učitani')}</span>}
      </div>
      {status === 'loading' && <p role="status" className="garage-api-tips-message">{t('Dohvaćanje podataka...')}</p>}
      {status === 'error' && (
        <div role="alert" className="garage-api-tips-message">
          <p>{t('Dohvat podataka nije uspio.')}</p>
          <button type="button" className="primary-button" onClick={retry}>{t('Pokušaj ponovno')}</button>
        </div>
      )}
      {status === 'success' && (
        <ul className="garage-api-tips-list">
          {tips.map((tip) => (
            <li key={tip.id}>
              <strong>{t(tip.title)}</strong>
              <p>{t(tip.description)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

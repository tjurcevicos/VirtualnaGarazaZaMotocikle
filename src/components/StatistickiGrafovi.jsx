import { usePreferences } from '../i18n/Preferences'
function formatNumber(value, digits = 1) {
  return Number(value).toLocaleString('hr-HR', { maximumFractionDigits: digits })
}

export function LinijskiGraf({ title, subtitle, points, unit = '' }) {
  const { t } = usePreferences()
  const values = points.filter((point) => Number.isFinite(point.value))
  const max = Math.max(...values.map((point) => point.value), 0.1)
  const min = Math.min(...values.map((point) => point.value), 0)
  const range = Math.max(max - min, 0.1)
  const x = (index) => 46 + (index / Math.max(values.length - 1, 1)) * 628
  const y = (value) => 184 - ((value - min) / range) * 145
  const path = values.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.value)}`).join(' ')

  return (
    <section className="analytics-panel">
      <div className="analytics-heading"><h2>{title}</h2><p>{subtitle}</p></div>
      {values.length < 2 ? (
        <p className="analytics-empty">{t('Za graf su potrebna najmanje dva usporediva točenja.')}</p>
      ) : (
        <div className="analytics-scroll">
          <svg className="analytics-line" viewBox="0 0 720 235" role="img" aria-label={title}>
            {[0, 1, 2, 3].map((step) => {
              const value = min + (range * step) / 3
              return <g key={step}><line x1="46" x2="674" y1={y(value)} y2={y(value)} stroke="#343a40" strokeDasharray="4 6" /><text x="38" y={y(value) + 4} textAnchor="end" fill="#aab2ba" fontSize="11">{formatNumber(value)}</text></g>
            })}
            <path d={path} fill="none" stroke="#f04452" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {values.map((point, index) => <g key={`${point.label}-${index}`}><circle cx={x(index)} cy={y(point.value)} r="5" fill="#f04452"><title>{point.label}: {formatNumber(point.value, 2)} {unit}</title></circle><text x={x(index)} y="216" fill="#aab2ba" fontSize="11" textAnchor="middle">{point.label}</text></g>)}
          </svg>
        </div>
      )}
    </section>
  )
}

export function StupcastiGraf({ title, subtitle, points, unit = '€' }) {
  const { t } = usePreferences()
  const max = Math.max(...points.map((point) => point.value), 1)
  return (
    <section className="analytics-panel">
      <div className="analytics-heading"><h2>{title}</h2><p>{subtitle}</p></div>
      {points.length === 0 ? <p className="analytics-empty">{t('Nema podataka za odabrani motocikl.')}</p> : (
        <div className="analytics-bars" role="img" aria-label={title}>
          {points.map((point) => <div className="analytics-bar-column" key={point.key}>
            <strong>{formatNumber(point.value, 2)} {unit}</strong>
            <div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ height: `${Math.max((point.value / max) * 100, point.value > 0 ? 3 : 0)}%` }} /></div>
            <span>{point.label}</span>
          </div>)}
        </div>
      )}
    </section>
  )
}

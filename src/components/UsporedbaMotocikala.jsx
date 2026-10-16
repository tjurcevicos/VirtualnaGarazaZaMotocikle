import { usePreferences } from '../i18n/Preferences'
import { useMemo, useState } from 'react'
import { ownershipForVehicle } from '../utils/garageInsights'

const euro = (value) => `${value.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
const categories = [
  { key: 'fuelCost', name: 'Gorivo', color: 'var(--vg-chart-fuel)' },
  { key: 'serviceCost', name: 'Servisi', color: 'var(--vg-chart-service)' },
  { key: 'extraCost', name: 'Ostalo', color: 'var(--vg-chart-other)' },
]

export default function UsporedbaMotocikala({ vehicles, services, fuelRecords, expenses }) {
  const { t } = usePreferences()
  const [selectedId, setSelectedId] = useState('')
  const ownership = useMemo(() => vehicles.map((vehicle) => ({
    vehicle,
    ...ownershipForVehicle(vehicle, services, fuelRecords, expenses),
  })), [vehicles, services, fuelRecords, expenses])
  const shown = selectedId ? ownership.filter((item) => String(item.vehicle.id) === selectedId) : ownership
  const maximum = Math.max(1, ...shown.map((item) => item.total))
  const breakdown = categories.map((category) => ({
    ...category,
    value: shown.reduce((sum, item) => sum + item[category.key], 0),
  }))
  const grandTotal = breakdown.reduce((sum, item) => sum + item.value, 0)
  const monthly = new Map()
  const selectedIds = new Set(shown.map((item) => String(item.vehicle.id)))
  const add = (record, value) => {
    if (!selectedIds.has(String(record.vehicleId))) return
    const month = String(record.date || '').slice(0, 7)
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) return
    monthly.set(month, (monthly.get(month) || 0) + amount)
  }
  services.forEach((item) => add(item, item.price))
  fuelRecords.forEach((item) => add(item, item.price))
  expenses.forEach((item) => {
    const category = String(item.category || '').toLocaleLowerCase('hr-HR').trim()
    if (category === 'servis' && services.some((service) => String(service.vehicleId) === String(item.vehicleId))) return
    if (category === 'gorivo' && fuelRecords.some((fuel) => String(fuel.vehicleId) === String(item.vehicleId))) return
    add(item, item.amount)
  })
  const points = [...monthly.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-12)
  const maxMonth = Math.max(1, ...points.map(([, amount]) => amount))
  const chartTotal = points.reduce((sum, [, amount]) => sum + amount, 0)
  const donut = grandTotal > 0 ? breakdown.reduce((acc, item) => {
    const start = acc.end
    const end = start + item.value / grandTotal * 100
    acc.stops.push(`${item.color} ${start}% ${end}%`)
    acc.end = end
    return acc
  }, { end: 0, stops: [] }).stops.join(', ') : 'var(--vg-soft) 0% 100%'

  return (
    <section className="garage-comparison" aria-label={t('Napredna statistika motocikala' )}>
      <div className="garage-comparison-heading">
        <div>
          <p className="page-label">{t('NAPREDNA STATISTIKA')}</p>
          <h2>{t('Usporedba motocikala')}</h2>
          <p className="page-description">{t('Usporedi evidentirane troškove, raspodjelu i mjesečne trendove.')}</p>
        </div>
        <label className="garage-comparison-filter">
          <span>{t('Motocikl')}</span>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            <option value="">{t('Svi motocikli')}</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model}</option>)}
          </select>
        </label>
      </div>
      {vehicles.length === 0 ? <p className="garage-comparison-empty">{t('Dodaj motocikl za prikaz statistike.')}</p> : (
        <div className="garage-comparison-grid">
          <div className="garage-comparison-panel garage-comparison-wide">
            <h3>{t('Ukupni troškovi po motociklu')}</h3>
            {shown.map((item) => <div className="garage-comparison-vehicle" key={item.vehicle.id}>
              <div className="garage-comparison-line"><strong>{item.vehicle.brand} {item.vehicle.model}</strong><span>{euro(item.total)}</span></div>
              <div className="garage-comparison-track" role="img" aria-label={`${t('Ukupni trošak')} ${euro(item.total)}`}>
                {categories.map((category) => <span key={category.key} style={{ width: `${item[category.key] / maximum * 100}%`, background: category.color }} />)}
              </div>
              <small>{t('Po kilometru')}: {item.perKm === null ? t('Nema podataka') : `${item.perKm.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/km`}</small>
            </div>)}
          </div>
          <div className="garage-comparison-panel">
            <h3>{t('Raspodjela troškova')}</h3>
            <div className="garage-comparison-donut" style={{ background: `conic-gradient(${donut})` }} aria-label={`${t('Ukupno')} ${euro(grandTotal)}`}>
              <div><small>{t('Ukupno')}</small><strong>{euro(grandTotal)}</strong></div>
            </div>
            <div className="garage-comparison-legend">{breakdown.map((item) => <div key={item.key}><span className="garage-comparison-dot" style={{ background: item.color }} /><span>{t(item.name)}</span><strong>{euro(item.value)}</strong></div>)}</div>
          </div>
          <div className="garage-comparison-panel">
            <h3>{t('Mjesečni trend troškova')}</h3>
            {points.length === 0 ? <p className="garage-comparison-empty">{t('Nema evidentiranih troškova s datumom.')}</p> : <>
              <div className="garage-comparison-months">{points.map(([month, amount]) => <div className="garage-comparison-month" key={month} title={`${month}: ${euro(amount)}`}>
                <span>{euro(amount)}</span>
                <div className="garage-comparison-month-track"><div style={{ height: `${Math.max(3, amount / maxMonth * 100)}%` }} /></div>
                <small>{month.slice(5)}.{month.slice(2, 4)}.</small>
              </div>)}</div>
              <p className="garage-comparison-period">{t('Ukupno za prikazane mjesece:')}<strong>{euro(chartTotal)}</strong></p>
            </>}
          </div>
        </div>
      )}
    </section>
  )
}

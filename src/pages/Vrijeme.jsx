import { useEffect, useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'

const weatherLabel = (code) => {
  if (code === 0) return 'Sunčano'
  if ([1, 2].includes(code)) return 'Pretežno vedro'
  if (code === 3) return 'Oblačno'
  if ([45, 48].includes(code)) return 'Magla'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) return 'Kiša'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snijeg'
  if ([80, 81, 82].includes(code)) return 'Pljuskovi'
  if ([95, 96, 99].includes(code)) return 'Grmljavina'
  return 'Promjenjivo'
}
const weatherIcon = (code) => {
  if (code === 0) return '☀️'
  if ([1, 2].includes(code)) return '🌤️'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '🌨️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  if ([80, 81, 82].includes(code)) return '🌧️'
  return '🌦️'
}
const rating = (day) => {
  let score = 100
  const temp = Number(day.temperature_2m_max)
  const rain = Number(day.precipitation_probability_max || 0)
  const wind = Number(day.wind_speed_10m_max || 0)
  const gust = Number(day.wind_gusts_10m_max || 0)
  if (temp < 5) score -= 55
  else if (temp < 10) score -= 35
  else if (temp < 15) score -= 16
  else if (temp > 35) score -= 35
  else if (temp > 30) score -= 15
  score -= rain >= 80 ? 55 : rain >= 60 ? 42 : rain >= 35 ? 26 : rain >= 15 ? 12 : 0
  score -= wind >= 45 ? 35 : wind >= 30 ? 22 : wind >= 20 ? 12 : 0
  score -= gust >= 65 ? 30 : gust >= 45 ? 18 : gust >= 30 ? 8 : 0
  if ([71, 73, 75, 77, 85, 86, 95, 96, 99].includes(day.weather_code)) score -= 35
  return Math.max(0, Math.min(100, score))
}
const status = (score) => score >= 85 ? 'Odlično za vožnju' : score >= 65 ? 'Dobro za vožnju' : score >= 40 ? 'Potreban oprez' : 'Nepovoljno za vožnju'
const grade = (score) => score >= 85 ? 'excellent' : score >= 65 ? 'good' : score >= 40 ? 'caution' : 'poor'
const localeMap = { hr: 'hr-HR', en: 'en-GB', de: 'de-DE', it: 'it-IT', sl: 'sl-SI' }

export default function Vrijeme({ trips = [] }) {
  const { t, language } = usePreferences()
  const [place, setPlace] = useState({ name: 'Zagreb', country: 'Hrvatska', latitude: 45.815, longitude: 15.982 })
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const tripPlaces = useMemo(() => trips.flatMap((trip) => (trip.places || trip.stops || trip.locations || []).map((stop) => ({ ...stop, tripName: trip.name || trip.title || '' }))).filter((stop) => Number.isFinite(Number(stop.lat ?? stop.latitude)) && Number.isFinite(Number(stop.lng ?? stop.lon ?? stop.longitude)) && (stop.lat ?? stop.latitude) !== '' && (stop.lng ?? stop.lon ?? stop.longitude) !== ''), [trips])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&timezone=auto&forecast_days=7`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('forecast'); return response.json() })
      .then((json) => { if (!json.daily?.time?.length) throw new Error('forecast'); setData(json); setSelected(0); setError(''); setLoading(false) })
      .catch((err) => { if (err.name !== 'AbortError') { setError('Prognoza trenutačno nije dostupna. Provjeri internetsku vezu.'); setData(null); setLoading(false) } })
    return () => controller.abort()
  }, [place])

  async function findCity(event) {
    event.preventDefault()
    if (search.trim().length < 2) { setSearchError('Unesi barem dva znaka za pretragu.'); return }
    setSearchError('')
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search.trim())}&count=8&language=${language}&format=json`)
      if (!response.ok) throw new Error('geocoding')
      const json = await response.json()
      setResults(json.results || [])
      if (!json.results?.length) setSearchError('Grad nije pronađen.')
    } catch { setSearchError('Prognoza trenutačno nije dostupna. Provjeri internetsku vezu.') }
  }

  const days = data?.daily?.time.map((date, index) => {
    const daily = data.daily
    const day = Object.fromEntries(Object.entries(daily).filter(([key]) => key !== 'time').map(([key, values]) => [key, values[index]]))
    return { ...day, date, score: rating(day) }
  }) || []
  const current = days[selected]
  const hours = data?.hourly?.time.map((time, index) => ({ time, temp: data.hourly.temperature_2m[index], rain: data.hourly.precipitation_probability[index], wind: data.hourly.wind_speed_10m[index], code: data.hourly.weather_code[index] })).filter((item) => item.time.startsWith(current?.date) && ['09', '12', '15', '18'].includes(item.time.slice(11, 13))) || []
  const dateText = (date) => new Intl.DateTimeFormat(localeMap[language] || 'hr-HR', { day: 'numeric', month: 'numeric' }).format(new Date(`${date}T12:00:00`))
  const dayText = (date) => new Intl.DateTimeFormat(localeMap[language] || 'hr-HR', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))

  return <section className="page weather-page">
    <div className="weather-heading"><div><p className="page-label">{t('PREGLED GARAŽE')}</p><h1>{t('Vrijeme za vožnju')}</h1><p className="page-description">{t('Provjeri uvjete prije polaska motociklom')}</p></div></div>
    <div className="weather-controls">
      <form className="weather-search" onSubmit={findCity}><label htmlFor="weather-city">{t('Pretraži grad')}</label><div><input id="weather-city" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Pretraži grad')} /><button type="submit">{t('Traži')}</button></div></form>
      {tripPlaces.length > 0 && <label className="weather-trip-select">{t('Odaberi mjesto iz putovanja')}<select value="" onChange={(e) => { const stop = tripPlaces[Number(e.target.value)]; if (!stop) return; setLoading(true); setResults([]); setPlace({ name: stop.name || stop.title || stop.label || t('Odaberi mjesto'), country: stop.tripName, latitude: Number(stop.lat ?? stop.latitude), longitude: Number(stop.lng ?? stop.lon ?? stop.longitude) }) }}><option value="">{t('Odaberi mjesto')}</option>{tripPlaces.map((stop, index) => <option key={index} value={index}>{stop.name || stop.title || stop.label || `${Number(stop.lat ?? stop.latitude).toFixed(3)}, ${Number(stop.lng ?? stop.lon ?? stop.longitude).toFixed(3)}`}</option>)}</select></label>}
    </div>
    {searchError && <p className="weather-error" role="alert">{t(searchError)}</p>}
    {results.length > 0 && <div className="weather-results"><strong>{t('Pronađene lokacije')}</strong><div>{results.map((result) => <button key={result.id} type="button" onClick={() => { setPlace({ name: result.name, country: result.country || '', latitude: result.latitude, longitude: result.longitude }); setLoading(true); setResults([]); setSearch('') }}>{result.name}{result.admin1 ? `, ${result.admin1}` : ''}, {result.country}</button>)}</div></div>}
    <div className="weather-place">📍 {place.name}{place.country ? `, ${place.country}` : ''}</div>
    {loading && <div className="weather-message" role="status">{t('Učitavanje prognoze...')}</div>}
    {error && !loading && <div className="weather-message" role="alert">{t(error)} <button type="button" onClick={() => { setLoading(true); setPlace({ ...place }) }}>↻</button></div>}
    {!loading && current && <>
      <article className="weather-hero"><div className="weather-hero-top"><div><span>{t('Odabrani dan')} · {dayText(current.date)} {dateText(current.date)}</span><h2>{t(weatherLabel(current.weather_code))}</h2></div><span className="weather-big-icon" aria-hidden="true">{weatherIcon(current.weather_code)}</span></div><div className="weather-main-reading"><strong>{Math.round(current.temperature_2m_max)}°C</strong><div className={`weather-status weather-${grade(current.score)}`}><b>{t(status(current.score))}</b><small>{t('Ocjena uvjeta')}: {current.score}/100</small></div></div><div className="weather-meter"><span className={`weather-${grade(current.score)}`} style={{ width: `${current.score}%` }} /></div><div className="weather-facts"><div><span>{t('Oborine')}</span><strong>{current.precipitation_probability_max ?? 0}%</strong></div><div><span>{t('Vjetar')}</span><strong>{Math.round(current.wind_speed_10m_max)} km/h</strong></div><div><span>{t('Udari vjetra')}</span><strong>{Math.round(current.wind_gusts_10m_max)} km/h</strong></div><div><span>{t('Najniža')}</span><strong>{Math.round(current.temperature_2m_min)}°C</strong></div></div></article>
      <section className="weather-section"><h2>{t('Prognoza za 7 dana')}</h2><div className="weather-days">{days.map((day, index) => <button key={day.date} type="button" className={`weather-day ${selected === index ? 'is-selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>{dayText(day.date)}</span><span>{dateText(day.date)}</span><span className="weather-day-icon">{weatherIcon(day.weather_code)}</span><strong>{Math.round(day.temperature_2m_max)}°</strong><small>{day.precipitation_probability_max ?? 0}% ☔</small><i className={`weather-${grade(day.score)}`} /></button>)}</div><p className="weather-hint">{t('Odaberi dan za detaljnu prognozu.')}</p></section>
      <section className="weather-section"><h2>{t('Prognoza po satima')}</h2><div className="weather-hours">{hours.length ? hours.map((hour) => <div className="weather-hour" key={hour.time}><span>{hour.time.slice(11, 16)}</span><span className="weather-day-icon">{weatherIcon(hour.code)}</span><strong>{Math.round(hour.temp)}°C</strong><small>☔ {hour.rain ?? 0}%</small><small>💨 {Math.round(hour.wind)} km/h</small></div>) : <p>{t('Nema prognoze za odabrani dan.')}</p>}</div></section>
      <aside className="weather-advice"><strong>{t('Savjet za motocikliste')}</strong><p>{t(current.score >= 85 ? 'Uvjeti izgledaju povoljno. Provjeri stanje cesta i lokalna upozorenja.' : current.score >= 40 ? 'Moguće su promjene vremena. Pripazi na vjetar i mokar kolnik.' : 'Razmisli o odgodi vožnje zbog mogućih nepovoljnih uvjeta.')}</p></aside>
    </>}
    <footer className="weather-footer">{t('Prognoza je informativna i ne jamči sigurnost vožnje.')} · <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">{t('Izvor prognoze: Open-Meteo')}</a></footer>
  </section>
}

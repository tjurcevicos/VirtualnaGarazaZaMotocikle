import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { usePreferences } from '../i18n/Preferences'

const markerIcon = L.divIcon({ className: 'trip-marker', html: '<span>📍</span>', iconSize: [34, 38], iconAnchor: [17, 36] })
const initialMap = [45.815, 15.982]
const blankTrip = () => ({ id: '', title: '', vehicleId: '', date: new Date().toISOString().slice(0, 10), status: 'planned', distance: '', notes: '', places: [] })

function MapClick({ onPlace }) {
  useMapEvents({ click(event) { onPlace(event.latlng) } })
  return null
}

function MapBounds({ places }) {
  const map = useMap()
  const signature = places.map((place) => `${place.lat},${place.lng}`).join('|')
  useEffect(() => {
    if (places.length === 1) map.setView([places[0].lat, places[0].lng], 11)
    if (places.length > 1) map.fitBounds(places.map((place) => [place.lat, place.lng]), { padding: [32, 32], maxZoom: 12 })
  }, [map, signature])
  return null
}

export default function Putovanja({ vehicles, trips, onSetTrips }) {
  const { t } = usePreferences()
  const [activeId, setActiveId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(blankTrip)
  const [placeDraft, setPlaceDraft] = useState(null)
  const [filter, setFilter] = useState('all')
  const visibleTrips = useMemo(() => trips.filter((trip) => filter === 'all' || String(trip.vehicleId) === filter).sort((a, b) => String(b.date).localeCompare(String(a.date))), [trips, filter])
  const selected = trips.find((trip) => String(trip.id) === String(activeId))
  const current = editing ? form : selected
  const points = Array.isArray(current?.places) ? current.places : []
  const motorcycleName = (id) => {
    const vehicle = vehicles.find((item) => String(item.id) === String(id))
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : t('Bez motocikla')
  }
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  const newTrip = () => { setForm(blankTrip()); setActiveId(null); setEditing(true); setPlaceDraft(null) }
  const editTrip = (trip) => { setForm({ ...trip, places: [...(trip.places || [])] }); setActiveId(trip.id); setEditing(true); setPlaceDraft(null) }
  const cancel = () => { setEditing(false); setPlaceDraft(null) }
  const saveTrip = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date) return
    const saved = { ...form, title: form.title.trim(), id: form.id || crypto.randomUUID(), places: form.places || [] }
    onSetTrips((previous) => form.id ? previous.map((trip) => String(trip.id) === String(form.id) ? saved : trip) : [...previous, saved])
    setActiveId(saved.id)
    setEditing(false)
    setPlaceDraft(null)
  }
  const deleteTrip = (trip) => {
    if (!window.confirm(t('Obrisati ovo putovanje?'))) return
    onSetTrips((previous) => previous.filter((item) => String(item.id) !== String(trip.id)))
    setActiveId(null)
    setEditing(false)
  }
  const addPlace = () => {
    if (!placeDraft?.name.trim()) return
    const place = { id: crypto.randomUUID(), name: placeDraft.name.trim(), notes: placeDraft.notes.trim(), lat: placeDraft.lat, lng: placeDraft.lng }
    update('places', [...form.places, place])
    setPlaceDraft(null)
  }
  const handleMapClick = (latlng) => {
    const source = editing ? form : current
    if (!source) return
    const places = Array.isArray(source.places) ? source.places : []
    const place = { id: crypto.randomUUID(), name: `${t('Naziv mjesta')} ${places.length + 1}`, notes: '', lat: latlng.lat, lng: latlng.lng }
    const next = [...places, place]
    if (editing) {
      update('places', next)
    } else {
      onSetTrips((previous) => previous.map((trip) => String(trip.id) === String(source.id) ? { ...trip, places: next } : trip))
    }
    setPlaceDraft(null)
  }
  const removePlace = (id) => {
    if (editing) {
      update('places', form.places.filter((place) => place.id !== id))
    } else if (current) {
      onSetTrips((previous) => previous.map((trip) => String(trip.id) === String(current.id) ? { ...trip, places: (trip.places || []).filter((place) => place.id !== id) } : trip))
    }
  }
  const editPlace = (id, key, value) => {
    update('places', form.places.map((place) => place.id === id ? { ...place, [key]: value } : place))
  }
  const movePlace = (index, direction) => {
    const next = [...form.places]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    update('places', next)
  }
  return (
    <section className="page trips-page">
      <header className="trips-header">
        <div><p className="page-label">{t('DNEVNIK VOŽNJI')}</p><h1>{t('Putovanja')}</h1><p className="page-description">{t('Označi posjećena mjesta, zapiši uspomene i sačuvaj svoje vožnje.')}</p></div>
        <button type="button" className="trips-primary" onClick={newTrip}>+ {t('Novo putovanje')}</button>
      </header>
      <div className="trips-stats">
        <article><span>{t('Ukupno putovanja')}</span><strong>{trips.length}</strong></article>
        <article><span>{t('Posjećena mjesta')}</span><strong>{trips.reduce((sum, trip) => sum + (trip.places?.length || 0), 0)}</strong></article>
        <article><span>{t('Evidentirani kilometri')}</span><strong>{trips.reduce((sum, trip) => sum + (Number(trip.distance) > 0 ? Number(trip.distance) : 0), 0).toLocaleString()} km</strong></article>
      </div>
      <div className="trips-layout">
        <aside className="trips-panel">
          <div className="trips-panel-heading"><h2>{t('Moja putovanja')}</h2><select aria-label={t('Prikaži motocikl')} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">{t('Svi motocikli')}</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={String(vehicle.id)}>{vehicle.brand} {vehicle.model}</option>)}</select></div>
          {visibleTrips.length === 0 && <p className="trips-muted">{t('Još nema spremljenih putovanja.')}</p>}
          <div className="trips-list">{visibleTrips.map((trip) => <button key={trip.id} type="button" className={`trips-list-item ${String(activeId) === String(trip.id) && !editing ? 'selected' : ''}`} onClick={() => { setActiveId(trip.id); setEditing(false); setPlaceDraft(null) }}><strong>{trip.title}</strong><small>{trip.date} · {motorcycleName(trip.vehicleId)}</small><span>{trip.status === 'completed' ? t('Završeno') : t('Planirano')} · {trip.places?.length || 0} {t('lokacija')}</span></button>)}</div>
        </aside>
        <div className="trips-main">
          {!current && <div className="trips-welcome"><span>🗺️</span><h2>{t('Tvoja karta putovanja')}</h2><p>{t('Dodaj novo putovanje ili odaberi postojeće za pregled karte i napomena.')}</p><button type="button" className="trips-primary" onClick={newTrip}>{t('Započni planiranje')}</button></div>}
          {current && <>
            {editing ? <form id="trip-form" className="trips-form" onSubmit={saveTrip}>
              <div className="trips-form-grid"><label>{t('Naziv putovanja')}<input required maxLength="100" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder={t('Npr. Vikend vožnja')} /></label><label>{t('Motocikl')}<select value={form.vehicleId} onChange={(event) => update('vehicleId', event.target.value)}><option value="">{t('Bez motocikla')}</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model}</option>)}</select></label><label>{t('Datum')}<input type="date" required value={form.date} onChange={(event) => update('date', event.target.value)} /></label><label>{t('Status putovanja')}<select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="planned">{t('Planirano')}</option><option value="completed">{t('Završeno')}</option></select></label><label>{t('Prijeđeni kilometri')}<input type="number" min="0" max="999999" step="0.1" value={form.distance} onChange={(event) => update('distance', event.target.value)} placeholder="km" /></label></div>
              <label>{t('Napomene o putovanju')}<textarea rows="3" maxLength="3000" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder={t('Što želiš zapamtiti s ove vožnje?')} /></label>
            </form> : <div className="trips-detail-header"><div><p className="page-label">{current.status === 'completed' ? t('Završeno') : t('Planirano')}</p><h2>{current.title}</h2><p className="trips-muted">{current.date} · {motorcycleName(current.vehicleId)}{current.distance ? ` · ${current.distance} km` : ''}</p></div><div className="trips-actions"><button type="button" onClick={() => editTrip(current)}>{t('Uredi')}</button><button type="button" className="trips-danger" onClick={() => deleteTrip(current)}>{t('Obriši')}</button></div></div>}
            <div className="trips-map-title"><h3>{t('Karta mjesta')}</h3><span>{t('Klikni na kartu za dodavanje mjesta.')}</span></div>
            <div className="trips-map"><MapContainer center={initialMap} zoom={7} scrollWheelZoom={false} className="trips-leaflet"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapBounds places={points}/><MapClick onPlace={handleMapClick}/>{points.map((place, index) => <Marker key={place.id} position={[place.lat, place.lng]} icon={markerIcon}><Popup><strong>{index + 1}. {place.name}</strong>{place.notes && <p>{place.notes}</p>}<button type="button" className="trips-popup-delete" onClick={() => removePlace(place.id)}>{t('Ukloni')}</button></Popup></Marker>)}{points.length > 1 && <Polyline positions={points.map((place) => [place.lat, place.lng])} pathOptions={{ color: '#e3a249', weight: 3, dashArray: '7 6' }}/>}</MapContainer></div>
            <div className="trips-places"><h3>{t('Popis mjesta')} ({points.length})</h3>{points.length === 0 && <p className="trips-muted">{editing ? t('Klikni na željenu lokaciju na karti.') : t('Nema označenih mjesta.')}</p>}{points.map((place, index) => <div className="trips-place" key={place.id}><span className="trips-place-number">{index + 1}</span><div>{editing ? <><input className="trips-place-input" aria-label={t('Naziv mjesta')} maxLength="100" value={place.name} onChange={(event) => editPlace(place.id, 'name', event.target.value)} /><textarea className="trips-place-input" aria-label={t('Napomena o mjestu')} rows="2" maxLength="1000" value={place.notes || ''} onChange={(event) => editPlace(place.id, 'notes', event.target.value)} /></> : <><strong>{place.name}</strong>{place.notes && <p>{place.notes}</p>}</>}</div>{<div className="trips-actions">{editing && <><button type="button" onClick={() => movePlace(index, -1)} disabled={index === 0} aria-label={t('Pomakni gore')}>↑</button><button type="button" onClick={() => movePlace(index, 1)} disabled={index === points.length - 1} aria-label={t('Pomakni dolje')}>↓</button></>}<button type="button" className="trips-danger" onClick={() => removePlace(place.id)}>{t('Ukloni')}</button></div>}</div>)}</div>
            {!editing && current.notes && <div className="trips-notes"><h3>{t('Napomene o putovanju')}</h3><p>{current.notes}</p></div>}
            {editing && <div className="trips-form-actions"><button type="submit" form="trip-form" className="trips-primary">{t('Spremi putovanje')}</button><button type="button" onClick={cancel}>{t('Odustani')}</button></div>}
            <p className="trips-disclaimer">{t('Linija povezuje označena mjesta redoslijedom, ali nije cestovna ruta. Za učitavanje karte potrebna je internetska veza.')}</p>
          </>}
        </div>
      </div>
    </section>
  )
}

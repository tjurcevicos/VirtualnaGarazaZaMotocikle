import { useEffect, useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import { getGallery, optimizePhoto, removeGalleryPhoto, saveGalleryPhoto }
import { savePhoto } from '../utils/photoStorage' from '../utils/galleryStorage'
import '../styles/Galerija.css'

export default function Galerija({ vehicles, userId, onSelectVehicle }) {
  const { t } = usePreferences()
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [uploadVehicle, setUploadVehicle] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [ready, setReady] = useState(false)
  const [urls, setUrls] = useState(new Map())

  useEffect(() => {
    let active = true
    getGallery(userId).then((items) => { if (active) { setPhotos(items); setReady(true) } }).catch(() => { if (active) { setError(t('Galerija se ne može učitati.')); setReady(true) } })
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    const next = new Map()
    photos.forEach((photo) => { if (photo.blob) next.set(photo.id, URL.createObjectURL(photo.blob)) })
    setUrls(next)
    return () => { next.forEach((url) => URL.revokeObjectURL(url)) }
  }, [photos])

  const names = useMemo(() => new Map(vehicles.map((vehicle) => [String(vehicle.id), [vehicle.brand, vehicle.make, vehicle.manufacturer, vehicle.model, vehicle.name].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(' ') || t('Motocikl')])), [vehicles, t])
  const visible = useMemo(() => photos.filter((photo) => (filter === 'all' || String(photo.vehicleId) === filter) && `${names.get(String(photo.vehicleId)) || ''} ${photo.description || ''}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [photos, filter, search, names])
  const index = visible.findIndex((photo) => photo.id === selected)
  const current = index >= 0 ? visible[index] : null

  useEffect(() => {
    if (!current) return undefined
    function key(event) {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowRight') setSelected(visible[(index + 1) % visible.length].id)
      if (event.key === 'ArrowLeft') setSelected(visible[(index + visible.length - 1) % visible.length].id)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [current, visible, index])

  async function addPhotos(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length || !uploadVehicle) { setError(t('Odaberi motocikl i fotografije.')); return }
    if (files.length > 10) { setError(t('Odjednom možeš dodati najviše 10 fotografija.')); return }
    if (photos.filter((photo) => String(photo.vehicleId) === String(uploadVehicle)).length + files.length > 40) { setError(t('Najviše 40 fotografija po motociklu.')); return }
    setBusy(true); setError(''); setNotice('')
    const saved = []
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/') || file.size > 12 * 1024 * 1024) throw new Error(t('Fotografija mora biti slika manja od 12 MB.'))
        const blob = await optimizePhoto(file)
        const photo = { id: crypto.randomUUID(), userId: String(userId), vehicleId: String(uploadVehicle), description: description.trim().slice(0, 180), createdAt: new Date().toISOString(), blob }
        await saveGalleryPhoto(photo)
        saved.push(photo)
      }
      setPhotos((old) => [...old, ...saved]); setDescription(''); setNotice(t('Fotografije su spremljene.'))
    } catch (cause) {
      setPhotos((old) => [...old, ...saved]); setError(cause.message || t('Spremanje fotografija nije uspjelo.'))
    } finally { setBusy(false) }
  }

  async function setCover() {
    if (!current) return
    try { await savePhoto(current.vehicleId, current.blob, userId); setNotice(t('Naslovna fotografija je postavljena.')); setSelected(null) }
    catch { setError(t('Postavljanje naslovne fotografije nije uspjelo.')) }
  }

  async function deleteSelected() {
    if (!current || !window.confirm(t('Želiš li obrisati ovu fotografiju?'))) return
    try { await removeGalleryPhoto(current.id); setPhotos((old) => old.filter((photo) => photo.id !== current.id)); setSelected(null); setNotice(t('Fotografija je obrisana.')) }
    catch { setError(t('Brisanje fotografije nije uspjelo.')) }
  }

  return <section className="page galerija-page">
    <header className="galerija-header"><div><p className="galerija-eyebrow">{t('TVOJA MOTO GALERIJA')}</p><h1>{t('Galerija motocikala')}</h1><p>{t('Fotografije tvojih motocikala, putovanja i uspomena na dva kotača.')}</p></div><div className="galerija-counter"><strong>{photos.length}</strong><span>{t('fotografija')}</span></div></header>
    <section className="galerija-upload"><div><h2>{t('Dodaj fotografije')}</h2><p>{t('Fotografije se optimiziraju i spremaju u tvoj preglednik.')}</p></div><div className="galerija-upload-fields"><label>{t('Motocikl')}<select value={uploadVehicle} onChange={(event) => setUploadVehicle(event.target.value)}><option value="">{t('Odaberi motocikl')}</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{names.get(String(vehicle.id))}</option>)}</select></label><label>{t('Opis fotografije')}<input maxLength={180} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t('Primjerice, izlet na Papuk')} /></label><label className={`galerija-upload-button ${busy || !uploadVehicle ? 'disabled' : ''}`}>{busy ? t('Spremanje...') : t('Odaberi fotografije')}<input type="file" accept="image/*" multiple disabled={busy || !uploadVehicle} onChange={addPhotos}/></label></div></section>
    <div className="galerija-toolbar"><label><span className="sr-only">{t('Pretraži fotografije')}</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('Pretraži fotografije...')}/></label><label><span className="sr-only">{t('Filtriraj po motociklu')}</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">{t('Svi motocikli')}</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{names.get(String(vehicle.id))}</option>)}</select></label></div>
    {error && <p className="galerija-alert" role="alert">{error}</p>}{notice && <p className="galerija-notice" role="status">{notice}</p>}
    {!ready ? <p className="galerija-empty">{t('Učitavanje fotografija...')}</p> : visible.length === 0 ? <div className="galerija-empty"><div className="galerija-empty-icon">▧</div><h2>{t('Još nema fotografija za prikaz')}</h2><p>{t('Odaberi motocikl i dodaj prve fotografije u svoju galeriju.')}</p></div> : <div className="galerija-grid">{visible.map((photo) => <button className="galerija-tile" key={photo.id} type="button" onClick={() => setSelected(photo.id)} aria-label={`${t('Otvori fotografiju')} ${names.get(String(photo.vehicleId))}`}><img src={urls.get(photo.id)} alt={photo.description || names.get(String(photo.vehicleId))} loading="lazy"/><span className="galerija-tile-overlay"><strong>{names.get(String(photo.vehicleId))}</strong>{photo.description && <small>{photo.description}</small>}</span></button>)}</div>}
    {current && <div className="galerija-lightbox" role="dialog" aria-modal="true" aria-label={t('Pregled fotografije')} onClick={() => setSelected(null)}><div className="galerija-lightbox-top"><span>{index + 1} / {visible.length}</span><button type="button" onClick={() => setSelected(null)} aria-label={t('Zatvori')}>×</button></div><div className="galerija-lightbox-stage" onClick={(event) => event.stopPropagation()}><button type="button" className="galerija-arrow" onClick={() => setSelected(visible[(index + visible.length - 1) % visible.length].id)} aria-label={t('Prethodna fotografija')}>‹</button><img src={urls.get(current.id)} alt={current.description || names.get(String(current.vehicleId))}/><button type="button" className="galerija-arrow" onClick={() => setSelected(visible[(index + 1) % visible.length].id)} aria-label={t('Sljedeća fotografija')}>›</button></div><div className="galerija-lightbox-footer" onClick={(event) => event.stopPropagation()}><div><strong>{names.get(String(current.vehicleId))}</strong>{current.description && <p>{current.description}</p>}</div><div className="galerija-lightbox-actions"><button type="button" onClick={() => { setSelected(null); const vehicle = vehicles.find((item) => String(item.id) === String(current.vehicleId)); if (vehicle) onSelectVehicle(vehicle) }}>{t('Detalji motocikla')}</button><button type="button" onClick={setCover}>{t('Postavi kao naslovnu fotografiju')}</button><button type="button" className="galerija-delete" onClick={deleteSelected}>{t('Obriši fotografiju')}</button></div></div></div>}
  </section>
}

import { useEffect, useState } from 'react'
import { getPhoto, savePhoto } from '../utils/photoStorage'

function Vozila({
  vehicles,
  onAddVehicle,
  onSelectVehicle,
}) {
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel: '',
    mileage: '',
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [photos, setPhotos] = useState({})
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Izračun URL-a izravno iz datoteke - bez useEffect-a i bez kršenja ESLint pravila
  const photoPreview = photoFile ? URL.createObjectURL(photoFile) : ''

  useEffect(() => {
    let cancelled = false
    const loadedUrls = []

    async function loadPhotos() {
      const entries = await Promise.all(
        vehicles.map(async (vehicle) => {
          try {
            const url = await getPhoto(vehicle.id)

            if (url) {
              loadedUrls.push(url)
            }

            return [vehicle.id, url]
          } catch {
            return [vehicle.id, null]
          }
        }),
      )

      if (cancelled) {
        loadedUrls.forEach((url) => URL.revokeObjectURL(url))
        return
      }

      setPhotos(Object.fromEntries(entries))
    }

    loadPhotos()

    return () => {
      cancelled = true
      loadedUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [vehicles])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    // Ako već postoji stari pregled, oslobađamo memoriju prije odabira nove slike
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Odabrana datoteka mora biti fotografija.')
      event.target.value = ''
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Fotografija ne smije biti veća od 8 MB.')
      event.target.value = ''
      return
    }

    setPhotoFile(file)
    setError('')
  }

  function resetForm() {
    // Oslobađamo memoriju od privremenog URL-a pri zatvaranju/resetu forme
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    setFormData({
      brand: '',
      model: '',
      year: '',
      fuel: '',
      mileage: '',
    })

    setPhotoFile(null)
    setError('')
    setShowForm(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const year = Number(formData.year)
    const mileage = Number(formData.mileage)

    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.fuel ||
      formData.mileage === ''
    ) {
      setError('Molimo ispuni sva obavezna polja.')
      return
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      setError(
        `Godina motocikla mora biti između 1900. i ${new Date().getFullYear()}.`,
      )
      return
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      setError('Kilometraža ne može biti negativna.')
      return
    }

    const vehicle = {
      id: Date.now(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year,
      fuel: formData.fuel,
      mileage,
    }

    setIsSaving(true)
    setError('')

    try {
      if (photoFile) {
        await savePhoto(vehicle.id, photoFile)
      }

      onAddVehicle(vehicle)
      resetForm()
    } catch {
      setError(
        'Fotografiju nije bilo moguće spremiti. Pokušaj ponovno.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">MOJA GARAŽA</p>

          <h1>Moji motocikli</h1>

          <p className="page-description">
            Dodaj i upravljaj svojim motociklima na jednom mjestu.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
        >
          {showForm ? 'Zatvori' : '+ Dodaj motocikl'}
        </button>
      </div>

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Dodaj motocikl</h2>

            <p>
              Unesi osnovne podatke i odaberi fotografiju svog motocikla.
            </p>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="brand">Marka</label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="npr. Suzuki"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model</label>

              <input
                id="model"
                name="model"
                type="text"
                placeholder="npr. GSX-R 1300 Hayabusa"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Godina</label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder="npr. 2022"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel">Gorivo</label>

              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">Odaberi gorivo</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Električni">Električni</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Kilometraža</label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                placeholder="npr. 25000"
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group vehicle-photo-field">
            <label htmlFor="vehicle-photo">
              Fotografija motocikla (nije obavezna)
            </label>

            <input
              id="vehicle-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <p className="photo-help">
              Odaberi fotografiju do 8 MB.
            </p>

            {photoPreview && (
              <div className="vehicle-photo-preview">
                <img
                  src={photoPreview}
                  alt="Pregled fotografije motocikla"
                />

                <button
                  type="button"
                  className="service-cancel-button"
                  onClick={() => {
                    if (photoPreview) {
                      URL.revokeObjectURL(photoPreview)
                    }
                    setPhotoFile(null)

                    const input = document.getElementById('vehicle-photo')
                    if (input) {
                      input.value = ''
                    }
                  }}
                >
                  Ukloni fotografiju
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={isSaving}
            >
              {isSaving ? 'Spremanje...' : 'Spremi motocikl'}
            </button>
          </div>
        </form>
      )}

      {/* Popis vozila (kartice/lista) */}
      <div className="vehicles-list">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            className="vehicle-card"
            onClick={() => onSelectVehicle(vehicle)}
          >
            {photos[vehicle.id] ? (
              <img src={photos[vehicle.id]} alt={`${vehicle.brand} ${vehicle.model}`} />
            ) : (
              <div className="no-photo">Nema fotografije</div>
            )}
            <h3>{vehicle.brand} {vehicle.model}</h3>
            <p>{vehicle.year}. god | {vehicle.mileage} km</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Vozila

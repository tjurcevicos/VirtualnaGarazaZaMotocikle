import { usePreferences } from '../i18n/Preferences'

import { useEffect, useRef, useState } from 'react'
import { getPhoto, savePhoto } from '../utils/photoStorage'

function Vozila({
  vehicles,
  onAddVehicle,
  onSelectVehicle,
}) {
  const { t } = usePreferences()
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel: '',
    mileage: '',
    initialMileage: '',
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photos, setPhotos] = useState({})
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const previewUrlRef = useRef(null)
  const photoInputRef = useRef(null)

  function clearPhotoPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }

    setPhotoPreview('')
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadedUrls = []

    async function loadPhotos() {
      try {
        const entries = await Promise.all(
          vehicles.map(async (vehicle) => {
            try {
              const url = await getPhoto(vehicle.id)

              if (url) {
                loadedUrls.push(url)
              }

              return [vehicle.id, url]
            } catch (photoError) {
              console.error(
                `Učitavanje fotografije motocikla ${vehicle.id} nije uspjelo:`,
                photoError,
              )

              return [vehicle.id, null]
            }
          }),
        )

        if (cancelled) {
          loadedUrls.forEach((url) => {
            URL.revokeObjectURL(url)
          })

          return
        }

        setPhotos(Object.fromEntries(entries))
      } catch (loadError) {
        console.error(
          'Učitavanje fotografija nije uspjelo:',
          loadError,
        )
      }
    }

    loadPhotos()

    return () => {
      cancelled = true

      loadedUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
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


    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(t("Odabrana datoteka mora biti fotografija."))
      event.target.value = ''
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(t("Fotografija ne smije biti veća od 8 MB."))
      event.target.value = ''
      return
    }

    clearPhotoPreview()

    const previewUrl = URL.createObjectURL(file)

    previewUrlRef.current = previewUrl

    setPhotoPreview(previewUrl)
    setPhotoFile(file)
    setError('')
  }

  function handleRemovePhoto() {
    clearPhotoPreview()
    setPhotoFile(null)

    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }

    setError('')
  }

  function resetForm() {
    clearPhotoPreview()

    setFormData({
      brand: '',
      model: '',
      year: '',
      fuel: '',
      mileage: '',
    initialMileage: '',
    })

    setPhotoFile(null)
    setError('')
    setShowForm(false)

    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSaving) {
      return
    }

    const year = Number(formData.year)
    const mileage = Number(formData.mileage)
    const initialMileage = Number(formData.initialMileage)

    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.fuel ||
      formData.mileage === ''
    ) {
      setError(t("Molimo ispuni sva obavezna polja."))
      return
    }

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      setError(
        `Godina motocikla mora biti između 1900. i ${new Date().getFullYear()}.`,
      )
      return
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      setError(t("Kilometraža ne može biti negativna."))
      return
    }

    if (formData.initialMileage === '' || !Number.isFinite(initialMileage) || initialMileage < 0 || initialMileage > mileage) {
      setError(t("Početna kilometraža mora biti između 0 i trenutačne kilometraže."))
      return
    }

    const vehicle = {
      id: Date.now(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year,
      fuel: formData.fuel,
      mileage,
      initialMileage,
    }

    setIsSaving(true)
    setError('')

    try {
      if (photoFile) {
        await savePhoto(vehicle.id, photoFile)
      }

      onAddVehicle(vehicle)
      resetForm()
    } catch (saveError) {
      console.error(
        'Spremanje motocikla ili fotografije nije uspjelo:',
        saveError,
      )

      setError(t("Motocikl nije bilo moguće spremiti. Provjeri podatke i pokušaj ponovno."))
    } finally {
      setIsSaving(false)
    }
  }

  function handleVehicleKeyDown(event, vehicle) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectVehicle(vehicle)
    }
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">{t('MOJA GARAŽA')}</p>

          <h1>{t('Moji motocikli')}</h1>

          <p className="page-description">
            {t("Dodaj i upravljaj svojim motociklima na jednom mjestu.")}
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
          disabled={isSaving}
        >
          {showForm ? t("Zatvori") : t("+ Dodaj motocikl")}
        </button>
      </div>

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>{t('Dodaj motocikl')}</h2>

            <p>
              {t("Unesi osnovne podatke i odaberi fotografiju svog motocikla.")}
            </p>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="brand">{t('Marka')}</label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder={t('npr. Suzuki' )}
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">{t('Model')}</label>

              <input
                id="model"
                name="model"
                type="text"
                placeholder={t('npr. GSX-R 1300 Hayabusa' )}
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">{t('Godina')}</label>

              <input
                id="year"
                name="year"
                type="number"
                placeholder={t('npr. 2022' )}
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel">{t('Gorivo')}</label>

              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              >
                <option value="">{t('Odaberi gorivo')}</option>
                <option value="Benzin">{t('Benzin')}</option>
                <option value="Dizel">{t('Dizel')}</option>
                <option value="Električni">{t('Električni')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mileage">{t('Kilometraža')}</label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                placeholder={t('npr. 25000' )}
                min="0"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>
              <div className="form-group">
                <label htmlFor="initialMileage">{t('Početna kilometraža evidencije (km)')}</label>
                <input id="initialMileage" name="initialMileage" type="number" min="0" step="1" placeholder={t('npr. 24000' )} value={formData.initialMileage} onChange={handleChange} required />
              </div>
          </div>

          <div className="form-group vehicle-photo-field">
            <label htmlFor="vehicle-photo">
              {t("Fotografija motocikla (nije obavezna)")}
            </label>

            <input
              ref={photoInputRef}
              id="vehicle-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

            <p className="photo-help">
              {t("Odaberi fotografiju do 8 MB.")}
            </p>

            {photoPreview && (
              <div className="vehicle-photo-preview">
                <img
                  src={photoPreview}
                  alt={t('Pregled fotografije motocikla' )}
                />

                <button
                  type="button"
                  className="service-cancel-button"
                  onClick={handleRemovePhoto}
                  disabled={isSaving}
                >
                  {t("Ukloni fotografiju")}
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
              {isSaving ? t("Spremanje...") : t("Spremi motocikl")}
            </button>
          </div>
        </form>
      )}

      <div className="vehicles-list">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="vehicle-card"
            role="button"
            tabIndex={0}
            onClick={() => onSelectVehicle(vehicle)}
            onKeyDown={(event) =>
              handleVehicleKeyDown(event, vehicle)
            }
            aria-label={`Otvori detalje motocikla ${vehicle.brand} ${vehicle.model}`}
          >
            <div className="vehicle-card-media">
              {photos[vehicle.id] ? (
                <img
                  src={photos[vehicle.id]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                />
              ) : (
                <div className="no-photo">{t('Nema fotografije')}</div>
              )}
              <span className="vehicle-card-year">{vehicle.year}.</span>
            </div>

            <div className="vehicle-card-content">
              <span className="vehicle-card-eyebrow">{t('MOJ MOTOCIKL')}</span>
              <h3>{vehicle.brand} {vehicle.model}</h3>
              <div className="vehicle-card-specs">
                <span>{t('Godina')}<strong>{vehicle.year}.</strong></span>
                <span>{t('Kilometraža')}<strong>{Number(vehicle.mileage).toLocaleString('hr-HR')} km</strong></span>
                <span>{t('Gorivo')}<strong>{vehicle.fuel || 'Nije navedeno'}</strong></span>
              </div>
              <span className="vehicle-card-action">{t('Detalji motocikla')}<span aria-hidden="true">→</span></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Vozila
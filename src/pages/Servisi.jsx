import KatalogDijelova from '../components/KatalogDijelova'
import OdabirDijelova from '../components/OdabirDijelova'
import '../styles/Validacija.css'
import useFieldValidation from '../hooks/useFieldValidation'
import PlanOdrzavanja from '../components/PlanOdrzavanja'
import { usePreferences } from '../i18n/Preferences'
import { useState } from 'react'

function Servisi({
  vehicles,
  services,
  serviceParts = [],
  onSetServiceParts,
  onAddService,
  onDeleteService,
  onUpdateService,
  maintenancePlans = [],
  onSetMaintenancePlans,
  reminders = [],
  onAddReminder,
}) {
  const { t, language } = usePreferences()
  const fieldValidation = useFieldValidation(t)
  const words = {
    hr: ['Katalog dijelova', 'Naziv dijela', 'Dodaj dio', 'Odaberi ugrađene dijelove', 'Ugrađeni dijelovi', 'Dio već postoji.', 'Unesi naziv dijela.', 'Nema dijelova u katalogu.', 'Dio je povezan sa servisima i ne može se obrisati.', 'Obriši dio'],
    en: ['Parts catalog', 'Part name', 'Add part', 'Select installed parts', 'Installed parts', 'Part already exists.', 'Enter a part name.', 'No parts in catalog.', 'Part is linked to services and cannot be deleted.', 'Delete part'],
    de: ['Teilekatalog', 'Teilename', 'Teil hinzufügen', 'Eingebaute Teile auswählen', 'Eingebaute Teile', 'Keine doppelten Teile erlaubt.', 'Teilename eingeben.', 'Keine Teile im Katalog.', 'Teil ist mit Wartungen verknüpft und kann nicht gelöscht werden.', 'Teil löschen'],
    it: ['Catalogo ricambi', 'Nome del ricambio', 'Aggiungi ricambio', 'Seleziona ricambi installati', 'Ricambi installati', 'Ricambio già presente.', 'Inserisci il nome del ricambio.', 'Nessun ricambio nel catalogo.', 'Il ricambio è collegato a interventi e non può essere eliminato.', 'Elimina ricambio'],
    sl: ['Katalog delov', 'Ime dela', 'Dodaj del', 'Izberi vgrajene dele', 'Vgrajeni deli', 'Del že obstaja.', 'Vnesi ime dela.', 'V katalogu ni delov.', 'Del je povezan s servisi in ga ni mogoče izbrisati.', 'Izbriši del'],
  }[language] || []
  const w = (index) => (words[index] || index)
  const [partName, setPartName] = useState('')
  const [partError, setPartError] = useState('')
  function addPart(event) {
    event.preventDefault()
    const name = partName.trim()
    if (!name) { setPartError(w(6)); return }
    if (serviceParts.some((part) => part.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { setPartError(w(5)); return }
    onSetServiceParts((current) => [...current, { id: crypto.randomUUID(), name }])
    setPartName('')
    setPartError('')
  }
  function removePart(id) {
    if (services.some((service) => (service.partIds || []).includes(id))) { setPartError(w(8)); return }
    onSetServiceParts((current) => current.filter((part) => part.id !== id))
    setPartError('')
  }
  function togglePart(id) {
    setFormData((current) => ({ ...current, partIds: current.partIds.includes(id) ? current.partIds.filter((value) => value !== id) : [...current.partIds, id] }))
  }
  const [showForm, setShowForm] = useState(false)
  const [editingServiceId, setEditingServiceId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: '',
    description: '',
    mileage: '',
    price: '',
    partIds: [],
  })

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  function resetForm() {
    setFormData({
      vehicleId: '',
      date: '',
      description: '',
      mileage: '',
      price: '',
      partIds: [],
    })

    setEditingServiceId(null)
    setError('')
    fieldValidation.clear()
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const mileage = Number(formData.mileage)
    const price = Number(formData.price)

    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.description.trim() ||
      formData.mileage === '' ||
      formData.price === ''
    ) {
      setError(t("Molimo ispuni sva polja."))
      return
    }

    if (mileage < 0) {
      setError(
        t("Kilometraža ne može biti negativna."),
      )
      return
    }

    if (price <= 0) {
      setError(
        t("Cijena servisa mora biti veća od 0."),
      )
      return
    }

    const selectedVehicle = vehicles.find(
      (vehicle) =>
        vehicle.id === Number(formData.vehicleId),
    )

    if (!selectedVehicle) {
      setError(
        t("Odabrani motocikl nije pronađen."),
      )
      return
    }

    const service = {
      id: editingServiceId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      date: formData.date,
      description: formData.description.trim(),
      mileage,
      price,
      partIds: formData.partIds,
    }

    if (editingServiceId) {
      onUpdateService(service)
    } else {
      onAddService(service)
    }

    resetForm()
  }

  function handleEditService(service) {
    setFormData({
      vehicleId: String(service.vehicleId),
      date: service.date,
      description: service.description,
      mileage: service.mileage,
      price: service.price,
      partIds: service.partIds || [],
    })

    setError('')
    setEditingServiceId(service.id)
    setShowForm(true)
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  const totalServiceCost = services.reduce(
    (total, service) =>
      total + Number(service.price),
    0,
  )

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            {t("ODRŽAVANJE")}
          </p>

          <h1>
            {t("Servisi")}
          </h1>

          <p className="page-description">
            {t("Pregledaj i evidentiraj servise svih svojih motocikala.")}
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
          disabled={vehicles.length === 0}
        >
          {showForm
            ? t("Zatvori")
            : t("+ Dodaj servis")}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            🔧
          </div>

          <h2>
            {t("Prvo dodaj motocikl")}
          </h2>

          <p>
            {t("Za evidentiranje servisa potrebno je prvo dodati motocikl u svoju garažu.")}
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          <KatalogDijelova
            words={words}
            parts={serviceParts}
            services={services}
            partName={partName}
            error={partError}
            onNameChange={(value) => { setPartName(value); setPartError('') }}
            onAdd={addPart}
            onRemove={removePart}
            deleteLabel={t('Obriši')}
          />

          <PlanOdrzavanja vehicles={vehicles} services={services} plans={maintenancePlans} onChange={onSetMaintenancePlans} reminders={reminders} onAddReminder={onAddReminder} />

          {services.length > 0 && (
            <div className="service-summary">
              <div className="service-summary-card">
                <span>
                  {t("Ukupno servisa")}
                </span>

                <strong>
                  {services.length}
                </strong>
              </div>

              <div className="service-summary-card">
                <span>
                  {t("Ukupno potrošeno")}
                </span>

                <strong>
                  {totalServiceCost.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>
            </div>
          )}

          {showForm && (
            <form
              className="vehicle-form service-page-form"
              onSubmit={handleSubmit}
              onBlurCapture={fieldValidation.onBlur}
              onChangeCapture={fieldValidation.onChange}
            >
              <div className="form-header">
                <h2>
                  {editingServiceId
                    ? t("Uredi servis")
                    : t("Dodaj servis")}
                </h2>

                <p>
                  {editingServiceId
                    ? t("Promijeni podatke o servisu.")
                    : t("Unesi podatke o obavljenom servisu.")}
                </p>
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              {Object.entries(fieldValidation.errors).filter(([, message]) => message).length > 0 && (
                <div className="garage-validation-summary" role="status" aria-live="polite">
                  {Object.entries(fieldValidation.errors).filter(([, message]) => message).map(([name, message]) => (
                    <p key={name}>{t(({ vehicleId: 'Motocikl', brand: 'Marka', model: 'Model', fuel: 'Gorivo', date: 'Datum', category: 'Kategorija', description: 'Opis', year: 'Godina', mileage: 'Kilometraža', initialMileage: 'Početna kilometraža', liters: 'Litara', unitPrice: 'Cijena po litri', price: 'Cijena', amount: 'Iznos' })[name] || name)}: {message}</p>
                  ))}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="serviceVehicleId">
                    {t("Motocikl")}
                  </label>

                  <select
                    id="serviceVehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {t("Odaberi motocikl")}
                    </option>

                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.brand}{' '}
                        {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="serviceDate">
                    {t("Datum")}
                  </label>

                  <input
                    id="serviceDate"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serviceMileage">
                    {t("Kilometraža")}
                  </label>

                  <input
                    id="serviceMileage"
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
                  <label htmlFor="servicePrice">
                    {t("Cijena")}
                  </label>

                  <input
                    id="servicePrice"
                    name="price"
                    type="number"
                    placeholder={t('npr. 150' )}
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group service-description-group">
                  <label htmlFor="serviceDescription">
                    {t("Opis servisa")}
                  </label>

                  <input
                    id="serviceDescription"
                    name="description"
                    type="text"
                    placeholder={t('npr. Zamjena ulja i filtera' )}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <OdabirDijelova
                words={words}
                parts={serviceParts}
                selectedIds={formData.partIds}
                onToggle={togglePart}
              />

              <div className="form-actions">
                {editingServiceId && (
                  <button
                    type="button"
                    className="service-cancel-button"
                    onClick={resetForm}
                  >
                    {t("Odustani")}
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingServiceId
                    ? t("Spremi promjene")
                    : t("Spremi servis")}
                </button>
              </div>
            </form>
          )}

          {services.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  🔧
                </div>

                <h2>
                  {t("Nema evidentiranih servisa")}
                </h2>

                <p>
                  {t("Dodaj prvi servis kako bi imao pregled održavanja svojih motocikala.")}
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  {t("+ Dodaj prvi servis")}
                </button>
              </div>
            )}

          {services.length > 0 && (
            <div className="services-list">
              {services.map((service) => {
                const vehicle = getVehicle(
                  service.vehicleId,
                )

                return (
                  <article
                    className="service-card"
                    key={service.id}
                  >
                    <div className="service-card-main">
                      <div className="service-icon">
                        🔧
                      </div>

                      <div>
                        <h3>
                          {service.description}
                        </h3>

                        <p>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : t("Nepoznati motocikl")}
                        </p>

                        {(service.partIds || []).length > 0 && (
                          <p className="service-parts-summary"><strong>{w(4)}:</strong> {(service.partIds || []).map((id) => serviceParts.find((part) => part.id === id)?.name).filter(Boolean).join(', ')}</p>
                        )}
                        <small>
                          {new Date(
                            service.date,
                          ).toLocaleDateString(
                            'hr-HR',
                          )}
                        </small>
                      </div>
                    </div>

                    <div className="service-card-details">
                      <div>
                        <span>
                          {t("Kilometraža")}
                        </span>

                        <strong>
                          {Number(
                            service.mileage,
                          ).toLocaleString(
                            'hr-HR',
                          )}{' '}
                          km
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t("Cijena")}
                        </span>

                        <strong>
                          {Number(
                            service.price,
                          ).toLocaleString(
                            'hr-HR',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{' '}
                          €
                        </strong>
                      </div>

                      <div className="service-actions">
                        <button
                          type="button"
                          className="service-edit-button"
                          onClick={() =>
                            handleEditService(
                              service,
                            )
                          }
                        >
                          {t("Uredi")}
                        </button>

                        <button
                          type="button"
                          className="service-delete-button"
                          onClick={() =>
                            onDeleteService(
                              service.id,
                            )
                          }
                        >
                          {t("Obriši")}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Servisi
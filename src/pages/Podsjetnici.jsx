import { usePreferences } from '../i18n/Preferences'
import { useState } from 'react'
import { reminderInfo, daysUntil } from '../utils/garageInsights'

function Podsjetnici({
  vehicles,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminder,
}) {
  const { t, language } = usePreferences()
  const [showForm, setShowForm] = useState(false)
  const [editingReminderId, setEditingReminderId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    title: '',
    date: '',
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
      type: '',
      title: '',
      date: '',
    })

    setEditingReminderId(null)
    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const reminderDate = new Date(formData.date)
    reminderDate.setHours(0, 0, 0, 0)

    if (
      !formData.vehicleId ||
      !formData.type ||
      !formData.title.trim() ||
      !formData.date
    ) {
      setError(t("Molimo ispuni sva polja."))
      return
    }

    if (Number.isNaN(reminderDate.getTime())) {
      setError(t("Odabrani datum nije ispravan."))
      return
    }

    if (reminderDate < today) {
      setError(
        'Datum podsjetnika ne može biti u prošlosti.',
      )
      return
    }

    const reminder = {
      id: editingReminderId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      type: formData.type,
      title: formData.title.trim(),
      date: formData.date,
    }

    if (editingReminderId) {
      onUpdateReminder(reminder)
    } else {
      onAddReminder(reminder)
    }

    resetForm()
  }

  function handleEditReminder(reminder) {
    setFormData({
      vehicleId: String(reminder.vehicleId),
      type: reminder.type,
      title: reminder.title,
      date: reminder.date,
    })

    setError('')
    setEditingReminderId(reminder.id)
    setShowForm(true)
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  function getReminderStatus(date) {
    return t(reminderInfo(date).label)
  }

  function getReminderDetail(date) {
    const info = reminderInfo(date)
    if (info.detail === 'Provjeri datum' || info.detail === 'Rok je danas') return t(info.detail)
    const days = daysUntil(date)
    return days === null ? t('Provjeri datum') : new Intl.RelativeTimeFormat(language, { numeric: 'always' }).format(days, 'day')
  }

  function getStatusClass(date) {
    return `reminder-status ${reminderInfo(date).kind}`
  }

  const [reminderFilter, setReminderFilter] = useState('all')
  const visibleReminders = reminders
    .filter((reminder) => reminderFilter === 'all' || reminderInfo(reminder.date).kind === reminderFilter)
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))

  const upcomingReminders = reminders.filter(
    (reminder) =>
      reminderInfo(reminder.date).kind === 'upcoming',
  ).length

  const expiredReminders = reminders.filter(
    (reminder) =>
      reminderInfo(reminder.date).kind === 'expired',
  ).length

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            {t("ORGANIZACIJA")}
          </p>

          <h1>
            {t("Podsjetnici")}
          </h1>

          <p className="page-description">
            {t("Prati važne rokove i obaveze vezane uz svoje motocikle.")}
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
            : t("+ Dodaj podsjetnik")}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            🔔
          </div>

          <h2>
            {t("Prvo dodaj motocikl")}
          </h2>

          <p>
            {t("Za dodavanje podsjetnika potrebno je prvo dodati motocikl u svoju garažu.")}
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {reminders.length > 0 && (
            <div className="reminder-summary">
              <div className="reminder-summary-card">
                <span>
                  {t("Ukupno podsjetnika")}
                </span>

                <strong>
                  {reminders.length}
                </strong>
              </div>

              <div className="reminder-summary-card">
                <span>
                  {t("Uskoro")}
                </span>

                <strong>
                  {upcomingReminders}
                </strong>
              </div>

              <div className="reminder-summary-card">
                <span>
                  {t("Isteklo")}
                </span>

                <strong>
                  {expiredReminders}
                </strong>
              </div>
            </div>
          )}

          {showForm && (
            <form
              className="vehicle-form reminder-form"
              onSubmit={handleSubmit}
            >
              <div className="form-header">
                <h2>
                  {editingReminderId
                    ? t("Uredi podsjetnik")
                    : t("Dodaj podsjetnik")}
                </h2>

                <p>
                  {editingReminderId
                    ? t("Promijeni podatke o podsjetniku.")
                    : t("Unesi podatke o novom podsjetniku.")}
                </p>
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="reminderVehicleId">
                    {t("Motocikl")}
                  </label>

                  <select
                    id="reminderVehicleId"
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
                  <label htmlFor="reminderType">
                    {t("Vrsta")}
                  </label>

                  <select
                    id="reminderType"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {t("Odaberi vrstu")}
                    </option>

                    <option value="Servis">
                      Servis
                    </option>

                    <option value="Registracija">
                      {t("Registracija")}
                    </option>

                    <option value="Osiguranje">
                      {t("Osiguranje")}
                    </option>

                    <option value="Tehnički pregled">
                      {t("Tehnički pregled")}
                    </option>

                    <option value="Gume">
                      {t("Gume")}
                    </option>

                    <option value="Ostalo">
                      {t("Ostalo")}
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reminderTitle">
                    {t("Naziv")}
                  </label>

                  <input
                    id="reminderTitle"
                    name="title"
                    type="text"
                    placeholder={t('npr. Godišnji servis' )}
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reminderDate">
                    {t("Datum")}
                  </label>

                  <input
                    id="reminderDate"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                {editingReminderId && (
                  <button
                    type="button"
                    className="reminder-cancel-button"
                    onClick={resetForm}
                  >
                    {t("Odustani")}
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingReminderId
                    ? t("Spremi promjene")
                    : t("Spremi podsjetnik")}
                </button>
              </div>
            </form>
          )}

          {reminders.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  🔔
                </div>

                <h2>
                  {t("Nema podsjetnika")}
                </h2>

                <p>
                  {t("Dodaj prvi podsjetnik kako bi lakše pratio važne rokove.")}
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  {t("+ Dodaj prvi podsjetnik")}
                </button>
              </div>
            )}

          {reminders.length > 0 && (
            <div className="garage-reminder-filters">
              <label htmlFor="reminderStatusFilter">{t('Prikaži podsjetnike')}</label>
              <select id="reminderStatusFilter" value={reminderFilter} onChange={(event) => setReminderFilter(event.target.value)}>
                <option value="all">{t('Svi rokovi')}</option>
                <option value="expired">{t('Istekli')}</option>
                <option value="upcoming">{t('Uskoro (7 dana)')}</option>
                <option value="active">{t('Aktivni')}</option>
              </select>
              <span>{visibleReminders.length} {t("prikazano")}</span>
            </div>
          )}
          {reminders.length > 0 && visibleReminders.length === 0 && (
            <div className="empty-state"><h2>{t('Nema podsjetnika za odabrani status')}</h2></div>
          )}
          {visibleReminders.length > 0 && (
            <div className="reminder-list">
              {visibleReminders.map((reminder) => {
                const vehicle = getVehicle(
                  reminder.vehicleId,
                )

                return (
                  <article
                    className="reminder-card"
                    key={reminder.id}
                  >
                    <div className="reminder-card-main">
                      <div className="reminder-icon">
                        🔔
                      </div>

                      <div>
                        <h2>
                          {reminder.title}
                        </h2>

                        <p>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : t("Nepoznati motocikl")}
                        </p>

                        <small>
                          {t(reminder.type)}
                        </small>
                      </div>
                    </div>

                    <div className="reminder-card-details">
                      <div>
                        <span>
                          {t("Datum")}
                        </span>

                        <strong>
                          {new Date(
                            reminder.date,
                          ).toLocaleDateString(
                            'hr-HR',
                          )}
                        </strong>
                      </div>

                      <span
                        className={getStatusClass(
                          reminder.date,
                        )}
                      >
                        {getReminderStatus(reminder.date)}
                        <small className="garage-reminder-days">{getReminderDetail(reminder.date)}</small>
                      </span>

                      <div className="reminder-actions">
                        <button
                          type="button"
                          className="reminder-edit-button"
                          onClick={() =>
                            handleEditReminder(
                              reminder,
                            )
                          }
                        >
                          {t("Uredi")}
                        </button>

                        <button
                          type="button"
                          className="reminder-delete-button"
                          onClick={() =>
                            onDeleteReminder(
                              reminder.id,
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

export default Podsjetnici
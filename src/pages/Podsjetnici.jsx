import { useState } from 'react'

function Podsjetnici({
  vehicles,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminder,
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingReminderId, setEditingReminderId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    title: '',
    date: '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function resetForm() {
    setFormData({
      vehicleId: '',
      type: '',
      title: '',
      date: '',
    })

    setEditingReminderId(null)
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const reminder = {
      id: editingReminderId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      type: formData.type,
      title: formData.title,
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

    setEditingReminderId(reminder.id)
    setShowForm(true)
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  function getReminderStatus(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const reminderDate = new Date(date)
    reminderDate.setHours(0, 0, 0, 0)

    const difference =
      reminderDate.getTime() -
      today.getTime()

    const days =
      difference / (1000 * 60 * 60 * 24)

    if (days < 0) {
      return 'Istekao'
    }

    if (days <= 7) {
      return 'Uskoro'
    }

    return 'Aktivan'
  }

  function getStatusClass(date) {
    const status = getReminderStatus(date)

    if (status === 'Istekao') {
      return 'reminder-status expired'
    }

    if (status === 'Uskoro') {
      return 'reminder-status upcoming'
    }

    return 'reminder-status active'
  }

  const upcomingReminders = reminders.filter(
    (reminder) =>
      getReminderStatus(reminder.date) ===
      'Uskoro',
  ).length

  const expiredReminders = reminders.filter(
    (reminder) =>
      getReminderStatus(reminder.date) ===
      'Istekao',
  ).length

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            ORGANIZACIJA
          </p>

          <h1>
            Podsjetnici
          </h1>

          <p className="page-description">
            Prati važne rokove i obaveze vezane
            uz svoje motocikle.
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
            ? 'Zatvori'
            : '+ Dodaj podsjetnik'}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            🔔
          </div>

          <h2>
            Prvo dodaj motocikl
          </h2>

          <p>
            Za dodavanje podsjetnika potrebno je
            prvo dodati motocikl u svoju garažu.
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {reminders.length > 0 && (
            <div className="reminder-summary">
              <div className="reminder-summary-card">
                <span>
                  Ukupno podsjetnika
                </span>

                <strong>
                  {reminders.length}
                </strong>
              </div>

              <div className="reminder-summary-card">
                <span>
                  Uskoro
                </span>

                <strong>
                  {upcomingReminders}
                </strong>
              </div>

              <div className="reminder-summary-card">
                <span>
                  Isteklo
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
                    ? 'Uredi podsjetnik'
                    : 'Dodaj podsjetnik'}
                </h2>

                <p>
                  {editingReminderId
                    ? 'Promijeni podatke o podsjetniku.'
                    : 'Unesi podatke o novom podsjetniku.'}
                </p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="reminderVehicleId">
                    Motocikl
                  </label>

                  <select
                    id="reminderVehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Odaberi motocikl
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
                    Vrsta
                  </label>

                  <select
                    id="reminderType"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Odaberi vrstu
                    </option>

                    <option value="Servis">
                      Servis
                    </option>

                    <option value="Registracija">
                      Registracija
                    </option>

                    <option value="Osiguranje">
                      Osiguranje
                    </option>

                    <option value="Tehnički pregled">
                      Tehnički pregled
                    </option>

                    <option value="Gume">
                      Gume
                    </option>

                    <option value="Ostalo">
                      Ostalo
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reminderTitle">
                    Naziv
                  </label>

                  <input
                    id="reminderTitle"
                    name="title"
                    type="text"
                    placeholder="npr. Godišnji servis"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reminderDate">
                    Datum
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
                    Odustani
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingReminderId
                    ? 'Spremi promjene'
                    : 'Spremi podsjetnik'}
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
                  Nema podsjetnika
                </h2>

                <p>
                  Dodaj prvi podsjetnik kako bi
                  lakše pratio važne rokove.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Dodaj prvi podsjetnik
                </button>
              </div>
            )}

          {reminders.length > 0 && (
            <div className="reminder-list">
              {reminders.map((reminder) => {
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
                            : 'Nepoznati motocikl'}
                        </p>

                        <small>
                          {reminder.type}
                        </small>
                      </div>
                    </div>

                    <div className="reminder-card-details">
                      <div>
                        <span>
                          Datum
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
                        {getReminderStatus(
                          reminder.date,
                        )}
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
                          Uredi
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
                          Obriši
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
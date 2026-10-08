import { useState } from 'react'

function Troskovi({
  vehicles,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingExpenseId, setEditingExpenseId] =
    useState(null)

  const [formData, setFormData] = useState({
    vehicleId: '',
    category: '',
    date: '',
    description: '',
    amount: '',
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
      category: '',
      date: '',
      description: '',
      amount: '',
    })

    setEditingExpenseId(null)
    setError('')
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const amount = Number(formData.amount)

    if (
      !formData.vehicleId ||
      !formData.category ||
      !formData.date ||
      !formData.description.trim() ||
      formData.amount === ''
    ) {
      setError('Molimo ispuni sva polja.')
      return
    }

    if (amount <= 0) {
      setError(
        'Iznos troška mora biti veći od 0.',
      )
      return
    }

    const expense = {
      id: editingExpenseId || Date.now(),
      vehicleId: Number(formData.vehicleId),
      category: formData.category,
      date: formData.date,
      description: formData.description.trim(),
      amount,
    }

    if (editingExpenseId) {
      onUpdateExpense(expense)
    } else {
      onAddExpense(expense)
    }

    resetForm()
  }

  function handleEditExpense(expense) {
    setFormData({
      vehicleId: String(expense.vehicleId),
      category: expense.category,
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
    })

    setError('')
    setEditingExpenseId(expense.id)
    setShowForm(true)
  }

  function getVehicle(vehicleId) {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    )
  }

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0,
  )

  const serviceExpenses = expenses
    .filter(
      (expense) =>
        expense.category === 'Servis',
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0,
    )

  const registrationExpenses = expenses
    .filter(
      (expense) =>
        expense.category === 'Registracija',
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0,
    )

  const otherExpenses = expenses
    .filter(
      (expense) =>
        expense.category !== 'Servis' &&
        expense.category !== 'Registracija',
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0,
    )

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            FINANCIJE
          </p>

          <h1>
            Troškovi
          </h1>

          <p className="page-description">
            Prati sve troškove povezane sa svojim
            motociklima.
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
            : '+ Dodaj trošak'}
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            €
          </div>

          <h2>
            Prvo dodaj motocikl
          </h2>

          <p>
            Za evidenciju troškova potrebno je
            prvo dodati motocikl u svoju garažu.
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {expenses.length > 0 && (
            <div className="expense-summary">
              <div className="expense-summary-card">
                <span>
                  Ukupno troškova
                </span>

                <strong>
                  {expenses.length}
                </strong>
              </div>

              <div className="expense-summary-card">
                <span>
                  Ukupno potrošeno
                </span>

                <strong>
                  {totalExpenses.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>

              <div className="expense-summary-card">
                <span>
                  Servisi
                </span>

                <strong>
                  {serviceExpenses.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>

              <div className="expense-summary-card">
                <span>
                  Registracija
                </span>

                <strong>
                  {registrationExpenses.toLocaleString(
                    'hr-HR',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  €
                </strong>
              </div>

              <div className="expense-summary-card">
                <span>
                  Ostalo
                </span>

                <strong>
                  {otherExpenses.toLocaleString(
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
              className="vehicle-form expense-form"
              onSubmit={handleSubmit}
            >
              <div className="form-header">
                <h2>
                  {editingExpenseId
                    ? 'Uredi trošak'
                    : 'Dodaj trošak'}
                </h2>

                <p>
                  {editingExpenseId
                    ? 'Promijeni podatke o trošku.'
                    : 'Unesi podatke o novom trošku.'}
                </p>
              </div>

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="expenseVehicleId">
                    Motocikl
                  </label>

                  <select
                    id="expenseVehicleId"
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
                  <label htmlFor="category">
                    Kategorija
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Odaberi kategoriju
                    </option>

                    <option value="Gorivo">
                      Gorivo
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

                    <option value="Oprema">
                      Oprema
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
                  <label htmlFor="expenseDate">
                    Datum
                  </label>

                  <input
                    id="expenseDate"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">
                    Iznos
                  </label>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="npr. 150"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group expense-description-group">
                  <label htmlFor="expenseDescription">
                    Opis
                  </label>

                  <input
                    id="expenseDescription"
                    name="description"
                    type="text"
                    placeholder="npr. Zamjena prednjih guma"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                {editingExpenseId && (
                  <button
                    type="button"
                    className="expense-cancel-button"
                    onClick={resetForm}
                  >
                    Odustani
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingExpenseId
                    ? 'Spremi promjene'
                    : 'Spremi trošak'}
                </button>
              </div>
            </form>
          )}

          {expenses.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  €
                </div>

                <h2>
                  Nema evidentiranih troškova
                </h2>

                <p>
                  Dodaj prvi trošak kako bi mogao
                  pratiti koliko ulažeš u svoje
                  motocikle.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Dodaj prvi trošak
                </button>
              </div>
            )}

          {expenses.length > 0 && (
            <div className="expense-list">
              {expenses.map((expense) => {
                const vehicle = getVehicle(
                  expense.vehicleId,
                )

                return (
                  <article
                    className="expense-card"
                    key={expense.id}
                  >
                    <div className="expense-card-main">
                      <div className="expense-icon">
                        €
                      </div>

                      <div>
                        <h2>
                          {expense.description}
                        </h2>

                        <p>
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}`
                            : 'Nepoznati motocikl'}
                        </p>

                        <small>
                          {new Date(
                            expense.date,
                          ).toLocaleDateString(
                            'hr-HR',
                          )}
                        </small>
                      </div>
                    </div>

                    <div className="expense-card-details">
                      <div>
                        <span>
                          Kategorija
                        </span>

                        <strong>
                          {expense.category}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Iznos
                        </span>

                        <strong>
                          {Number(
                            expense.amount,
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

                      <div className="expense-actions">
                        <button
                          type="button"
                          className="expense-edit-button"
                          onClick={() =>
                            handleEditExpense(
                              expense,
                            )
                          }
                        >
                          Uredi
                        </button>

                        <button
                          type="button"
                          className="expense-delete-button"
                          onClick={() =>
                            onDeleteExpense(
                              expense.id,
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

export default Troskovi
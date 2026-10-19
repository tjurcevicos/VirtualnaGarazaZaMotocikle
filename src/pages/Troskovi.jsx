import { usePreferences } from '../i18n/Preferences'
import { exportGaragePdf } from '../utils/pdfExport'
import { StupcastiGraf } from '../components/StatistickiGrafovi'
import { useState } from 'react'

function Troskovi({
  vehicles,
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
}) {
  const { t } = usePreferences()
  const [showForm, setShowForm] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [pdfBusy, setPdfBusy] = useState(false)
  const [filterVehicleId, setFilterVehicleId] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
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
      setError(t("Molimo ispuni sva polja."))
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

  const filteredExpenses = expenses
    .filter((expense) => !filterVehicleId || String(expense.vehicleId) === filterVehicleId)
    .filter((expense) => !filterCategory || expense.category === filterCategory)
    .filter((expense) => !filterFrom || String(expense.date || '') >= filterFrom)
    .filter((expense) => !filterTo || String(expense.date || '') <= filterTo)
    .sort((a, b) => {
      if (sortOrder === 'oldest') return String(a.date || '').localeCompare(String(b.date || ''))
      if (sortOrder === 'highest') return Number(b.amount || 0) - Number(a.amount || 0)
      if (sortOrder === 'lowest') return Number(a.amount || 0) - Number(b.amount || 0)
      return String(b.date || '').localeCompare(String(a.date || ''))
    })

  const filteredTotal = filteredExpenses.reduce((total, expense) => total + Number(expense.amount || 0), 0)
  const categories = [...new Set(expenses.map((expense) => expense.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'hr'))
  const filtersActive = Boolean(filterVehicleId || filterCategory || filterFrom || filterTo || sortOrder !== 'newest')

  const monthlyTotals = new Map()
  filteredExpenses.forEach((expense) => {
    const month = String(expense.date || '').slice(0, 7)
    if (!/^\d{4}-\d{2}$/.test(month)) return
    monthlyTotals.set(month, (monthlyTotals.get(month) || 0) + Number(expense.amount || 0))
  })
  const monthlyPoints = [...monthlyTotals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, value]) => ({ key, label: `${key.slice(5)}.${key.slice(2, 4)}.`, value }))

  async function handlePdfExport() {
    setPdfError('')
    setPdfBusy(true)
    try {
      const selectedVehicle = vehicles.find((vehicle) => String(vehicle.id) === filterVehicleId)
      await exportGaragePdf({
        title: t('Izvještaj o troškovima'),
        subtitle: selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Svi motocikli',
        summary: [
          ['Kategorija', filterCategory || 'Sve kategorije'],
          ['Od', filterFrom || 'Bez ograničenja'],
          ['Do', filterTo || 'Bez ograničenja'],
        ],
        rows: filteredExpenses.map((expense) => {
          const vehicle = vehicles.find((item) => String(item.id) === String(expense.vehicleId))
          return { ...expense, vehicle: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Nepoznati motocikl' }
        }),
        filename: 'virtualna-garaza-troskovi.pdf',
      })
    } catch (error) {
      console.error('Izvoz PDF-a nije uspio:', error)
      setPdfError('Izvještaj nije moguće izvesti. Pokušaj ponovno.')
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <section className="page">
      <div className="page-header vehicle-header">
        <div>
          <p className="page-label">
            {t("FINANCIJE")}
          </p>

          <h1>
            {t("Troškovi")}
          </h1>

          <p className="page-description">
            {t("Prati sve troškove povezane sa svojim motociklima.")}
          </p>
        </div>

        <div className="pdf-export-actions">
          <button type="button" className="primary-button" onClick={handlePdfExport} disabled={pdfBusy || filteredExpenses.length === 0}>
            {pdfBusy ? t("Izvoz...") : t("Izvezi PDF")}
          </button>
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
            : t("+ Dodaj trošak")}
        </button>
        </div>
      </div>
      {pdfError && <div className="form-error" role="alert">{pdfError}</div>}

      {vehicles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            €
          </div>

          <h2>
            {t("Prvo dodaj motocikl")}
          </h2>

          <p>
            {t("Za evidenciju troškova potrebno je prvo dodati motocikl u svoju garažu.")}
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {expenses.length > 0 && (
            <div className="expense-summary">
              <div className="expense-summary-card">
                <span>
                  {t("Ukupno troškova")}
                </span>

                <strong>
                  {expenses.length}
                </strong>
              </div>

              <div className="expense-summary-card">
                <span>
                  {t("Ukupno potrošeno")}
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
                  {t("Servisi")}
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
                  {t("Registracija")}
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
                  {t("Ostalo")}
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
                    ? t("Uredi trošak")
                    : t("Dodaj trošak")}
                </h2>

                <p>
                  {editingExpenseId
                    ? t("Promijeni podatke o trošku.")
                    : t("Unesi podatke o novom trošku.")}
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
                    {t("Motocikl")}
                  </label>

                  <select
                    id="expenseVehicleId"
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
                  <label htmlFor="category">
                    {t("Kategorija")}
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {t("Odaberi kategoriju")}
                    </option>

                    <option value="Gorivo">
                      {t("Gorivo")}
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

                    <option value="Oprema">
                      {t("Oprema")}
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
                  <label htmlFor="expenseDate">
                    {t("Datum")}
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
                    {t("Iznos")}
                  </label>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder={t('npr. 150' )}
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group expense-description-group">
                  <label htmlFor="expenseDescription">
                    {t("Opis")}
                  </label>

                  <input
                    id="expenseDescription"
                    name="description"
                    type="text"
                    placeholder={t('npr. Zamjena prednjih guma' )}
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
                    {t("Odustani")}
                  </button>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingExpenseId
                    ? t("Spremi promjene")
                    : t("Spremi trošak")}
                </button>
              </div>
            </form>
          )}

          <div className="expense-filter-panel">
            <div className="expense-filter-heading">
              <div>
                <h2>{t('Filtriranje troškova')}</h2>
                <p>{t('Pronađi troškove prema motociklu, kategoriji i razdoblju.')}</p>
              </div>
              <button type="button" className="expense-filter-reset" disabled={!filtersActive} onClick={() => {
                setFilterVehicleId('')
                setFilterCategory('')
                setFilterFrom('')
                setFilterTo('')
                setSortOrder('newest')
              }}>{t('Poništi filtre')}</button>
            </div>
            <div className="expense-filter-grid">
              <div className="form-group">
                <label htmlFor="expense-vehicle-filter">{t('Motocikl')}</label>
                <select id="expense-vehicle-filter" value={filterVehicleId} onChange={(event) => setFilterVehicleId(event.target.value)}>
                  <option value="">{t('Svi motocikli')}</option>
                  {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="expense-category-filter">{t('Kategorija')}</label>
                <select id="expense-category-filter" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
                  <option value="">{t('Sve kategorije')}</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="expense-from-filter">{t('Datum od')}</label>
                <input id="expense-from-filter" type="date" max={filterTo || undefined} value={filterFrom} onChange={(event) => setFilterFrom(event.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="expense-to-filter">{t('Datum do')}</label>
                <input id="expense-to-filter" type="date" min={filterFrom || undefined} value={filterTo} onChange={(event) => setFilterTo(event.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="expense-sort-filter">{t('Poredak')}</label>
                <select id="expense-sort-filter" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="newest">{t('Najnoviji prvo')}</option>
                  <option value="oldest">{t('Najstariji prvo')}</option>
                  <option value="highest">{t('Najveći iznos prvo')}</option>
                  <option value="lowest">{t('Najmanji iznos prvo')}</option>
                </select>
              </div>
            </div>
            <div className="expense-filter-results" aria-live="polite">
              <span>{t('Prikazano')}<strong>{filteredExpenses.length}</strong> od {expenses.length} troškova</span>
              <span>{t('Ukupno u odabiru')}<strong>{filteredTotal.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></span>
            </div>
          </div>
          <div className="analytics-section">
            <StupcastiGraf title={t('Mjesečni troškovi' )} subtitle={t('Ukupni evidentirani troškovi po mjesecima, do 12 posljednjih mjeseci s unosima.')} points={monthlyPoints} />
          </div>

          {expenses.length === 0 &&
            !showForm && (
              <div className="empty-state">
                <div className="empty-icon">
                  €
                </div>

                <h2>
                  {t("Nema evidentiranih troškova")}
                </h2>

                <p>
                  {t("Dodaj prvi trošak kako bi mogao pratiti koliko ulažeš u svoje motocikle.")}
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  {t("+ Dodaj prvi trošak")}
                </button>
              </div>
            )}

          {expenses.length > 0 && filteredExpenses.length === 0 && (
            <div className="empty-state"><h2>{t('Nema troškova za odabrane filtre')}</h2><p>{t('Promijeni razdoblje ili poništi filtre.')}</p></div>
          )}

          {expenses.length > 0 && filteredExpenses.length > 0 && (
            <div className="expense-list">
              {filteredExpenses.map((expense) => {
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
                            : t("Nepoznati motocikl")}
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
                          {t("Kategorija")}
                        </span>

                        <strong>
                          {t(expense.category)}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t("Iznos")}
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
                          {t("Uredi")}
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

export default Troskovi
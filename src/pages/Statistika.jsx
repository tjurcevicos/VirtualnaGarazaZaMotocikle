import { useMemo, useState } from 'react'
import { usePreferences } from '../i18n/Preferences'
import UsporedbaMotocikala from '../components/UsporedbaMotocikala'
import { daysUntil, ownershipForVehicle } from '../utils/garageInsights'

const validAmount = (value) => {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

export default function Statistika({ vehicles, services, fuelRecords, expenses, reminders, maintenancePlans, registrationRecords }) {
  const { t, language } = usePreferences()
  const [vehicleId, setVehicleId] = useState('all')
  const selected = (item) => vehicleId === 'all' || String(item.vehicleId) === vehicleId
  const shownVehicles = useMemo(() => vehicles.filter((vehicle) => vehicleId === 'all' || String(vehicle.id) === vehicleId), [vehicles, vehicleId])
  const shownServices = services.filter(selected)
  const shownFuel = fuelRecords.filter(selected)
  const shownExpenses = expenses.filter(selected)
  const shownReminders = reminders.filter(selected)
  const shownPlans = maintenancePlans.filter(selected)
  const shownRegistration = registrationRecords.filter(selected)
  const ownership = shownVehicles.map((vehicle) => ({ vehicle, ...ownershipForVehicle(vehicle, services, fuelRecords, expenses) }))
  const totals = ownership.reduce((result, item) => ({
    total: result.total + item.total,
    fuel: result.fuel + item.fuelCost,
    services: result.services + item.serviceCost,
    other: result.other + item.extraCost,
  }), { total: 0, fuel: 0, services: 0, other: 0 })
  const totalLiters = shownFuel.reduce((sum, record) => sum + validAmount(record.liters), 0)
  const upcoming = [...shownReminders.filter((item) => !item.completed && daysUntil(item.date) !== null && daysUntil(item.date) >= 0 && daysUntil(item.date) <= 30),
    ...shownRegistration.filter((item) => daysUntil(item.expiryDate) !== null && daysUntil(item.expiryDate) >= 0 && daysUntil(item.expiryDate) <= 30)]
  const expired = [...shownReminders.filter((item) => !item.completed && daysUntil(item.date) !== null && daysUntil(item.date) < 0),
    ...shownRegistration.filter((item) => daysUntil(item.expiryDate) !== null && daysUntil(item.expiryDate) < 0)]
  const currency = new Intl.NumberFormat(language === 'hr' ? 'hr-HR' : language, { style: 'currency', currency: 'EUR' })
  const decimal = new Intl.NumberFormat(language === 'hr' ? 'hr-HR' : language, { maximumFractionDigits: 2 })
  const metrics = [
    { label: t('Motocikli'), value: String(shownVehicles.length) },
    { label: t('Ukupni troškovi'), value: currency.format(totals.total) },
    { label: t('Servisi'), value: String(shownServices.length) },
    { label: t('Utočeno gorivo'), value: `${decimal.format(totalLiters)} L` },
    { label: t('Aktivni planovi održavanja'), value: String(shownPlans.length) },
    { label: t('Uskoro istječe (30 dana)'), value: String(upcoming.length) },
    { label: t('Istekli rokovi'), value: String(expired.length) },
    { label: t('Registracija i osiguranje'), value: String(shownRegistration.length) },
  ]

  return (
    <section className="page statistics-page">
      <div className="statistics-heading">
        <div>
          <p className="page-label">{t('PREGLED GARAŽE')}</p>
          <h1>{t('Statistika')}</h1>
          <p className="page-description">{t('Pregled troškova, održavanja i važnih rokova za tvoje motocikle.')}</p>
        </div>
        <label className="statistics-filter">
          <span>{t('Prikaži motocikl')}</span>
          <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
            <option value="all">{t('Svi motocikli')}</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={String(vehicle.id)}>{vehicle.brand} {vehicle.model}</option>)}
          </select>
        </label>
      </div>

      {vehicles.length === 0 ? (
        <div className="statistics-empty">{t('Dodaj motocikl za prikaz statistike.')}</div>
      ) : (
        <>
          <div className="statistics-metrics">
            {metrics.map((metric) => (
              <article className="statistics-metric" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>

          <section className="statistics-section">
            <div className="statistics-section-heading">
              <p className="page-label">{t('ANALIZA TROŠKOVA')}</p>
              <h2>{t('Trošak vlasništva po motociklu')}</h2>
              <p className="page-description">{t('Zbroj evidentiranog goriva, servisa i ostalih troškova.')}</p>
            </div>
            <div className="garage-ownership-grid">
              {ownership.map((item) => (
                <article className="garage-ownership-card" key={item.vehicle.id}>
                  <span className="garage-ownership-label">{item.vehicle.year} {t('· MOTOCIKL')}</span>
                  <h3>{item.vehicle.brand} {item.vehicle.model}</h3>
                  <div className="garage-ownership-total">
                    <span>{t('Ukupno evidentirano')}</span>
                    <strong>{currency.format(item.total)}</strong>
                  </div>
                  <div className="garage-ownership-breakdown">
                    <span>{t('Gorivo')}<strong>{currency.format(item.fuelCost)}</strong></span>
                    <span>{t('Servisi')}<strong>{currency.format(item.serviceCost)}</strong></span>
                    <span>{t('Ostalo')}<strong>{currency.format(item.extraCost)}</strong></span>
                    <span>{t('Po kilometru')}<strong>{item.perKm === null ? t('Nema podataka') : `${decimal.format(Number(item.perKm.toFixed(2)))} €/km`}</strong></span>
                  </div>
                  {item.omitted > 0 && <small>{t('Stavke goriva i servisa iz Troškova izostavljene su kada postoje zasebne evidencije tih kategorija.')}</small>}
                </article>
              ))}
            </div>
            <p className="garage-ownership-note">{t('Trošak po kilometru računa se prema razlici trenutačne i početne kilometraže evidencije. Za postojeće motocikle unesi početnu kilometražu u detaljima. Ne uključuje kupovnu cijenu motocikla.')}</p>
          </section>

          <UsporedbaMotocikala vehicles={shownVehicles} services={shownServices} fuelRecords={shownFuel} expenses={shownExpenses} />
          <p className="statistics-footnote">{t('Statistika se automatski ažurira prema podacima iz Vozila, Servisa, Goriva, Troškova, Podsjetnika te Registracije i osiguranja.')}</p>
        </>
      )}
    </section>
  )
}

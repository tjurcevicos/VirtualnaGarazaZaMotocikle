import UsporedbaMotocikala from '../components/UsporedbaMotocikala'
import { useEffect, useState } from 'react'
import { getPhoto } from '../utils/photoStorage'
import { reminderInfo, ownershipForVehicle } from '../utils/garageInsights'

function Home({

  vehicles,

  services,

  fuelRecords,

  expenses,

  reminders,

}) {
  const [photoSlides, setPhotoSlides] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    let cancelled = false
    const loadedUrls = []

    async function loadVehiclePhotos() {
      const photoResults = await Promise.all(
        vehicles.map(async (vehicle) => {
          try {
            const photoUrl = await getPhoto(vehicle.id)

            if (photoUrl) {
              loadedUrls.push(photoUrl)
              return { vehicle, photoUrl }
            }
          } catch (error) {
            console.error(
              `Učitavanje fotografije za ${vehicle.brand} ${vehicle.model} nije uspjelo:`,
              error,
            )
          }

          return null
        }),
      )

      const availableSlides = photoResults.filter(Boolean)

      if (cancelled) {
        loadedUrls.forEach((photoUrl) => URL.revokeObjectURL(photoUrl))
        return
      }

      setPhotoSlides(availableSlides)
      setActiveSlide(0)
    }

    loadVehiclePhotos()

    return () => {
      cancelled = true
      loadedUrls.forEach((photoUrl) => URL.revokeObjectURL(photoUrl))
    }
  }, [vehicles])

  useEffect(() => {
    if (photoSlides.length < 2) return undefined

    const slideInterval = window.setInterval(() => {
      setActiveSlide((currentSlide) =>
        (currentSlide + 1) % photoSlides.length,
      )
    }, 6000)

    return () => window.clearInterval(slideInterval)
  }, [photoSlides.length])

  const currentSlide = photoSlides[activeSlide]

  const totalFuel = fuelRecords.reduce(

    (total, record) =>

      total + Number(record.liters),

    0,

  )



  const totalExpenses = expenses.reduce(

    (total, expense) =>

      total + Number(expense.amount),

    0,

  )



  function calculateConsumption() {

    if (fuelRecords.length < 2) {

      return null

    }



    const vehicleIds = [

      ...new Set(

        fuelRecords.map(

          (record) => record.vehicleId,

        ),

      ),

    ]



    let totalKilometers = 0

    let totalLiters = 0



    vehicleIds.forEach((vehicleId) => {

      const vehicleRecords = fuelRecords

        .filter(

          (record) =>

            record.vehicleId === vehicleId,

        )

        .sort(

          (a, b) =>

            Number(a.mileage) -

            Number(b.mileage),

        )



      if (vehicleRecords.length < 2) {

        return

      }



      const firstRecord = vehicleRecords[0]



      const lastRecord =

        vehicleRecords[

          vehicleRecords.length - 1

        ]



      const kilometers =

        Number(lastRecord.mileage) -

        Number(firstRecord.mileage)



      const liters = vehicleRecords

        .slice(1)

        .reduce(

          (total, record) =>

            total + Number(record.liters),

          0,

        )



      if (kilometers > 0 && liters > 0) {

        totalKilometers += kilometers

        totalLiters += liters

      }

    })



    if (totalKilometers <= 0) {

      return null

    }



    return (

      (totalLiters / totalKilometers) *

      100

    )

  }



  const averageConsumption =

    calculateConsumption()



  function getVehicle(vehicleId) {

    return vehicles.find(

      (vehicle) => vehicle.id === vehicleId,

    )

  }



  const upcomingReminders = reminders

    .filter((reminder) => {

      const reminderDate = new Date(

        reminder.date,

      )



      const today = new Date()



      today.setHours(0, 0, 0, 0)

      reminderDate.setHours(0, 0, 0, 0)



      return reminderDate >= today

    })

    .sort(

      (a, b) =>

        new Date(a.date) -

        new Date(b.date),

    )

    .slice(0, 3)



  const urgentReminders = reminders
    .map((reminder) => ({ ...reminder, info: reminderInfo(reminder.date) }))
    .filter((reminder) => reminder.info.kind !== 'active')
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))

  const ownership = vehicles.map((vehicle) => ({
    vehicle,
    ...ownershipForVehicle(vehicle, services, fuelRecords, expenses),
  }))

  const formatEuro = (value) => `${value.toLocaleString('hr-HR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`

  const latestService = [...services]

    .sort(

      (a, b) =>

        new Date(b.date) -

        new Date(a.date),

    )[0]



  const latestFuel = [...fuelRecords]

    .sort(

      (a, b) =>

        new Date(b.date) -

        new Date(a.date),

    )[0]



  return (

    <section className="page">

      <section className={`garage-hero${currentSlide ? ' garage-hero-has-photo' : ''}`}>
        {currentSlide && (
          <img
            key={currentSlide.photoUrl}
            className="garage-hero-photo"
            src={currentSlide.photoUrl}
            alt={`${currentSlide.vehicle.brand} ${currentSlide.vehicle.model}`}
          />
        )}

        <div className="garage-hero-overlay" />

        <div className="garage-hero-content">
          <p className="page-label">VIRTUALNA GARAŽA</p>

          <h1>Dobrodošao u svoju garažu</h1>

          <p className="page-description">
            Pregled svih važnih podataka o tvojim motociklima na jednom mjestu.
          </p>

          {currentSlide && (
            <div className="garage-hero-bike">
              <span className="garage-hero-bike-label">U tvojoj garaži</span>
              <strong>
                {currentSlide.vehicle.brand} {currentSlide.vehicle.model}
              </strong>
              <span>
                {currentSlide.vehicle.year}
                {currentSlide.vehicle.mileage !== undefined &&
                  ` · ${Number(currentSlide.vehicle.mileage).toLocaleString('hr-HR')} km`}
              </span>
            </div>
          )}
        </div>

        {photoSlides.length > 1 && (
          <div className="garage-hero-controls" aria-label="Fotografije motocikala">
            <span className="garage-hero-slide-count">
              {activeSlide + 1} / {photoSlides.length}
            </span>
            <div className="garage-hero-dots">
              {photoSlides.map((slide, index) => (
                <button
                  key={slide.vehicle.id}
                  type="button"
                  className={`garage-hero-dot${index === activeSlide ? ' active' : ''}`}
                  aria-label={`Prikaži fotografiju motocikla ${slide.vehicle.brand} ${slide.vehicle.model}`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {urgentReminders.length > 0 && (
        <section className="garage-alerts" aria-label="Važni rokovi">
          <div className="garage-insight-heading">
            <div>
              <p className="page-label">VAŽNI ROKOVI</p>
              <h2>Podsjetnici koji traže pažnju</h2>
            </div>
            <strong>{urgentReminders.length}</strong>
          </div>
          <div className="garage-alert-list">
            {urgentReminders.slice(0, 4).map((reminder) => (
              <div className={`garage-alert garage-alert-${reminder.info.kind}`} key={reminder.id}>
                <div>
                  <strong>{reminder.title}</strong>
                  <span>{getVehicle(reminder.vehicleId)?.brand || 'Motocikl'} {getVehicle(reminder.vehicleId)?.model || ''} · {reminder.type}</span>
                </div>
                <span className="garage-alert-status">{reminder.info.detail}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {ownership.length > 0 && (
        <section className="garage-ownership" aria-label="Trošak vlasništva">
          <div className="garage-insight-heading">
            <div>
              <p className="page-label">ANALIZA TROŠKOVA</p>
              <h2>Trošak vlasništva po motociklu</h2>
              <p className="page-description">Zbroj evidentiranog goriva, servisa i ostalih troškova.</p>
            </div>
          </div>
          <div className="garage-ownership-grid">
            {ownership.map((item) => (
              <article className="garage-ownership-card" key={item.vehicle.id}>
                <span className="garage-ownership-label">{item.vehicle.year} · MOTOCIKL</span>
                <h3>{item.vehicle.brand} {item.vehicle.model}</h3>
                <div className="garage-ownership-total">
                  <span>Ukupno evidentirano</span>
                  <strong>{formatEuro(item.total)}</strong>
                </div>
                <div className="garage-ownership-breakdown">
                  <span>Gorivo <strong>{formatEuro(item.fuelCost)}</strong></span>
                  <span>Servisi <strong>{formatEuro(item.serviceCost)}</strong></span>
                  <span>Ostalo <strong>{formatEuro(item.extraCost)}</strong></span>
                  <span>Po kilometru <strong>{item.perKm === null ? 'Nema podataka' : `${item.perKm.toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/km`}</strong></span>
                </div>
                {item.omitted > 0 && <small>Stavke goriva i servisa iz Troškova izostavljene su kada postoje zasebne evidencije tih kategorija.</small>}
              </article>
            ))}
          </div>
          <p className="garage-ownership-note">Trošak po kilometru računa se prema razlici trenutačne i početne kilometraže evidencije. Za postojeće motocikle unesi početnu kilometražu u detaljima. Ne uključuje kupovnu cijenu motocikla.</p>
        </section>
      )}

      <UsporedbaMotocikala vehicles={vehicles} services={services} fuelRecords={fuelRecords} expenses={expenses} />

      <div className="dashboard-summary">

        <div className="dashboard-card">

          <span>

            Motocikli

          </span>



          <strong>

            {vehicles.length}

          </strong>



          <small>

            u garaži

          </small>

        </div>



        <div className="dashboard-card">

          <span>

            Servisi

          </span>



          <strong>

            {services.length}

          </strong>



          <small>

            evidentirano

          </small>

        </div>



        <div className="dashboard-card">

          <span>

            Gorivo

          </span>



          <strong>

            {totalFuel.toLocaleString(

              'hr-HR',

              {

                minimumFractionDigits: 2,

                maximumFractionDigits: 2,

              },

            )}{' '}

            L

          </strong>



          <small>

            ukupno natočeno

          </small>

        </div>



        <div className="dashboard-card">

          <span>

            Troškovi

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



          <small>

            evidentirano

          </small>

        </div>



        <div className="dashboard-card">

          <span>

            Potrošnja

          </span>



          <strong>

            {averageConsumption !== null

              ? `${averageConsumption.toLocaleString(

                  'hr-HR',

                  {

                    minimumFractionDigits: 2,

                    maximumFractionDigits: 2,

                  },

                )} L`

              : '—'}

          </strong>



          <small>

            L/100 km

          </small>

        </div>

      </div>



      <div className="dashboard-grid">

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <p className="page-label">

                GARAŽA

              </p>



              <h2>

                Moji motocikli

              </h2>

            </div>

          </div>



          {vehicles.length === 0 ? (

            <div className="dashboard-empty">

              <span>

                🏍️

              </span>



              <p>

                Još nemaš dodanih motocikala.

              </p>

            </div>

          ) : (

            <div className="dashboard-vehicle-list">

              {vehicles.map((vehicle) => (

                <div

                  className="dashboard-vehicle"

                  key={vehicle.id}

                >

                  <div className="dashboard-vehicle-icon">

                    {photoSlides.find(
                      (slide) => String(slide.vehicle.id) === String(vehicle.id),
                    )?.photoUrl ? (
                      <img
                        src={photoSlides.find(
                          (slide) => String(slide.vehicle.id) === String(vehicle.id),
                        ).photoUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          display: 'block',
                        }}
                      />
                    ) : (
                      '🏍️'
                    )}

                  </div>



                  <div>

                    <strong>

                      {vehicle.brand}{' '}

                      {vehicle.model}

                    </strong>



                    <span>

                      {vehicle.year} •{' '}

                      {Number(

                        vehicle.mileage,

                      ).toLocaleString(

                        'hr-HR',

                      )}{' '}

                      km

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>



        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <p className="page-label">

                ROKOVI

              </p>



              <h2>

                Nadolazeći podsjetnici

              </h2>

            </div>

          </div>



          {upcomingReminders.length === 0 ? (

            <div className="dashboard-empty">

              <span>

                🔔

              </span>



              <p>

                Nema nadolazećih podsjetnika.

              </p>

            </div>

          ) : (

            <div className="dashboard-reminder-list">

              {upcomingReminders.map(

                (reminder) => {

                  const vehicle = getVehicle(

                    reminder.vehicleId,

                  )



                  return (

                    <div

                      className="dashboard-reminder"

                      key={reminder.id}

                    >

                      <div className="dashboard-reminder-icon">

                        🔔

                      </div>



                      <div>

                        <strong>

                          {reminder.title}

                        </strong>



                        <span>

                          {vehicle

                            ? `${vehicle.brand} ${vehicle.model}`

                            : 'Nepoznati motocikl'}

                        </span>

                      </div>



                      <time>

                        {new Date(

                          reminder.date,

                        ).toLocaleDateString(

                          'hr-HR',

                        )}

                      </time>

                    </div>

                  )

                },

              )}

            </div>

          )}

        </div>

      </div>



      <div className="dashboard-grid">

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <p className="page-label">

                SERVIS

              </p>



              <h2>

                Posljednji servis

              </h2>

            </div>

          </div>



          {!latestService ? (

            <div className="dashboard-empty">

              <span>

                🔧

              </span>



              <p>

                Još nema evidentiranih servisa.

              </p>

            </div>

          ) : (

            <div className="dashboard-activity">

              <div className="dashboard-activity-icon">

                🔧

              </div>



              <div>

                <strong>

                  {latestService.description}

                </strong>



                <span>

                  {getVehicle(

                    latestService.vehicleId,

                  )

                    ? `${getVehicle(

                        latestService.vehicleId,

                      ).brand} ${getVehicle(

                        latestService.vehicleId,

                      ).model}`

                    : 'Nepoznati motocikl'}

                </span>



                <small>

                  {new Date(

                    latestService.date,

                  ).toLocaleDateString(

                    'hr-HR',

                  )}{' '}

                  •{' '}

                  {Number(

                    latestService.price,

                  ).toLocaleString(

                    'hr-HR',

                    {

                      minimumFractionDigits: 2,

                      maximumFractionDigits: 2,

                    },

                  )}{' '}

                  €

                </small>

              </div>

            </div>

          )}

        </div>



        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <p className="page-label">

                GORIVO

              </p>



              <h2>

                Posljednje točenje

              </h2>

            </div>

          </div>



          {!latestFuel ? (

            <div className="dashboard-empty">

              <span>

                ⛽

              </span>



              <p>

                Još nema evidentiranih točenja.

              </p>

            </div>

          ) : (

            <div className="dashboard-activity">

              <div className="dashboard-activity-icon">

                ⛽

              </div>



              <div>

                <strong>

                  {getVehicle(

                    latestFuel.vehicleId,

                  )

                    ? `${getVehicle(

                        latestFuel.vehicleId,

                      ).brand} ${getVehicle(

                        latestFuel.vehicleId,

                      ).model}`

                    : 'Nepoznati motocikl'}

                </strong>



                <span>

                  {Number(

                    latestFuel.liters,

                  ).toLocaleString(

                    'hr-HR',

                    {

                      minimumFractionDigits: 2,

                      maximumFractionDigits: 2,

                    },

                  )}{' '}

                  L

                </span>



                <small>

                  {new Date(

                    latestFuel.date,

                  ).toLocaleDateString(

                    'hr-HR',

                  )}{' '}

                  •{' '}

                  {Number(

                    latestFuel.price,

                  ).toLocaleString(

                    'hr-HR',

                    {

                      minimumFractionDigits: 2,

                      maximumFractionDigits: 2,

                    },

                  )}{' '}

                  €

                </small>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>

  )

}
export default Home
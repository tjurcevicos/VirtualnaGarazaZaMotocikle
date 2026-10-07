function Home({
  vehicles,
  services,
  fuelRecords,
  expenses,
  reminders,
}) {
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
      <div className="page-header">
        <div>
          <p className="page-label">
            VIRTUALNA GARAŽA
          </p>

          <h1>
            Dobrodošao u svoju garažu
          </h1>

          <p className="page-description">
            Pregled svih važnih podataka o
            tvojim motociklima na jednom mjestu.
          </p>
        </div>
      </div>

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
                    🏍️
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
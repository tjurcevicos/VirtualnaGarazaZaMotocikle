
export function calculateFuelStatistics(records) {
  const validRecords = records.filter((record) => {
    const liters = Number(record.liters)
    const price = Number(record.price)

    return (
      Number.isFinite(liters) &&
      Number.isFinite(price) &&
      liters > 0 &&
      price > 0
    )
  })

  const totalLiters = validRecords.reduce(
    (total, record) => total + Number(record.liters),
    0,
  )

  const totalCost = validRecords.reduce(
    (total, record) => total + Number(record.price),
    0,
  )

  const pricesPerLiter = validRecords.map(
    (record) => Number(record.price) / Number(record.liters),
  )

  const averagePricePerLiter =
    totalLiters > 0 ? totalCost / totalLiters : null

  const lowestPricePerLiter =
    pricesPerLiter.length > 0
      ? Math.min(...pricesPerLiter)
      : null

  const highestPricePerLiter =
    pricesPerLiter.length > 0
      ? Math.max(...pricesPerLiter)
      : null

  const mileages = records
    .map((record) => Number(record.mileage))
    .filter(
      (mileage) =>
        Number.isFinite(mileage) && mileage >= 0,
    )

  const firstMileage =
    mileages.length >= 2 ? Math.min(...mileages) : null

  const lastMileage =
    mileages.length >= 2 ? Math.max(...mileages) : null

  const distance =
    firstMileage !== null && lastMileage !== null
      ? lastMileage - firstMileage
      : null

  const sortedRecords = [...validRecords].sort(
    (a, b) => Number(a.mileage) - Number(b.mileage),
  )

  const firstRecordMileage =
    sortedRecords.length >= 2
      ? Number(sortedRecords[0].mileage)
      : null

  const litersAfterFirst =
    firstRecordMileage !== null
      ? sortedRecords
          .slice(1)
          .reduce(
            (total, record) => total + Number(record.liters),
            0,
          )
      : 0

  const costAfterFirst =
    firstRecordMileage !== null
      ? sortedRecords
          .slice(1)
          .reduce(
            (total, record) => total + Number(record.price),
            0,
          )
      : 0

  const fuelCostPerKm =
    distance !== null && distance > 0
      ? costAfterFirst / distance
      : null

  return {
    totalFillUps: records.length,
    totalLiters,
    totalCost,
    averagePricePerLiter,
    lowestPricePerLiter,
    highestPricePerLiter,
    distance,
    fuelCostPerKm,
    litersAfterFirst,
  }
}

export function calculateVehicleFuelStatistics(
  fuelRecords,
  vehicleId,
) {
  const vehicleRecords = fuelRecords.filter(
    (record) =>
      String(record.vehicleId) === String(vehicleId),
  )

  return calculateFuelStatistics(vehicleRecords)
}

export function calculatePricePerLiter(record) {
  const liters = Number(record.liters)
  const price = Number(record.price)

  if (
    !Number.isFinite(liters) ||
    !Number.isFinite(price) ||
    liters <= 0 ||
    price <= 0
  ) {
    return null
  }

  return price / liters
}
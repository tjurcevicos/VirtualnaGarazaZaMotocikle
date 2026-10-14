
export function addVehicle(currentVehicles, vehicle) {
  return [...currentVehicles, vehicle]
}

export function updateVehicle(currentVehicles, updatedVehicle) {
  return currentVehicles.map((vehicle) =>
    vehicle.id === updatedVehicle.id
      ? updatedVehicle
      : vehicle,
  )
}

export function deleteVehicle(currentVehicles, id) {
  return currentVehicles.filter(
    (vehicle) => vehicle.id !== id,
  )
}

export function deleteVehicleRelatedData(records, vehicleId) {
  return records.filter(
    (record) => record.vehicleId !== vehicleId,
  )
}
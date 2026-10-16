export function daysUntil(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString))) return null
  const [year, month, day] = dateString.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  if (target.getFullYear() !== year || target.getMonth() !== month - 1 || target.getDate() !== day) return null
  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((Date.UTC(year, month - 1, day) - today) / 86400000)
}

export function reminderInfo(dateString) {
  const days = daysUntil(dateString)
  if (days === null) return { label: 'Nepoznat rok', detail: 'Provjeri datum', kind: 'active' }
  if (days < 0) return { label: 'Istekao', detail: `Kasni ${Math.abs(days)} dana`, kind: 'expired' }
  if (days === 0) return { label: 'Danas', detail: 'Rok je danas', kind: 'upcoming' }
  if (days <= 7) return { label: 'Uskoro', detail: `Za ${days} dana`, kind: 'upcoming' }
  return { label: 'Aktivan', detail: `Za ${days} dana`, kind: 'active' }
}

export function ownershipForVehicle(vehicle, services, fuelRecords, expenses) {
  const id = String(vehicle.id)
  const own = (record) => String(record.vehicleId) === id
  const serviceItems = services.filter(own)
  const fuelItems = fuelRecords.filter(own)
  const expenseItems = expenses.filter(own)
  const sum = (items, field) => items.reduce((total, item) => {
    const amount = Number(item[field])
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0)
  }, 0)
  const serviceCost = sum(serviceItems, 'price')
  const fuelCost = sum(fuelItems, 'price')
  const otherExpenses = expenseItems.filter((expense) => {
    const category = String(expense.category || '').toLocaleLowerCase('hr-HR').trim()
    if (category === 'servis' && serviceItems.length) return false
    if (category === 'gorivo' && fuelItems.length) return false
    return true
  })
  const extraCost = sum(otherExpenses, 'amount')
  const total = serviceCost + fuelCost + extraCost
  const mileage = Number(vehicle.mileage)
  const perKm = Number.isFinite(mileage) && mileage > 0 ? total / mileage : null
  return { serviceCost, fuelCost, extraCost, total, perKm, omitted: expenseItems.length - otherExpenses.length }
}

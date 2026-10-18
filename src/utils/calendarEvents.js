const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function addMonths(dateText, count) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateText ?? '')) || !Number.isInteger(Number(count)) || Number(count) <= 0) return null
  const [year, month, day] = dateText.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  date.setDate(1)
  date.setMonth(date.getMonth() + Number(count))
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  date.setDate(Math.min(day, end))
  return localDate(date)
}

const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function buildCalendarEvents({ vehicles = [], services = [], reminders = [], maintenancePlans = [], registrationRecords = [] }) {
  const vehicleNames = new Map(vehicles.map((vehicle) => [String(vehicle.id), [vehicle.brand, vehicle.model].filter(Boolean).join(' ')]))
  const events = []
  const add = (source, record, date, title, type, page, completed = false) => {
    if (!validDate(date)) return
    events.push({ id: `${source}-${record.id}-${date}`, source, date, title, type, page, vehicleId: String(record.vehicleId ?? ''), vehicleName: vehicleNames.get(String(record.vehicleId)) ?? '', completed })
  }
  for (const record of reminders) add('reminder', record, record.date, record.title || 'Podsjetnik', 'reminder', 'podsjetnici', Boolean(record.completed))
  for (const record of services) add('service', record, record.date, record.type || record.title || 'Servis', 'service', 'servisi')
  for (const record of maintenancePlans) {
    const dueDate = addMonths(record.lastDate, record.intervalMonths)
    if (dueDate) add('maintenance', record, dueDate, record.title || 'Plan održavanja', 'maintenance', 'servisi')
  }
  const registrationTypes = { registration: 'Registracija', inspection: 'Tehnički pregled', insurance: 'Osiguranje' }
  for (const record of registrationRecords) add('registration', record, record.expiryDate, registrationTypes[record.type] || 'Registracija i osiguranje', 'registration', 'vozila')
  return events.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
}

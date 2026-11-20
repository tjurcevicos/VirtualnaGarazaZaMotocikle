const rules = {
  vehicleId: 'required', brand: 'required', model: 'required', fuel: 'required',
  date: 'required', category: 'required', description: 'required',
  year: 'year', mileage: 'nonnegative', initialMileage: 'nonnegative',
  liters: 'positive', unitPrice: 'positive', price: 'positive', amount: 'positive',
}

export function validateGarageField(name, value, t = (message) => message) {
  const rule = rules[name]
  if (!rule) return ''
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return t('Obavezno polje.')
  if (rule === 'required') return ''
  const number = Number(trimmed)
  if (!Number.isFinite(number)) return t('Unesi valjanu brojčanu vrijednost.')
  if (rule === 'year') {
    if (!Number.isInteger(number) || number < 1900 || number > new Date().getFullYear()) {
      return t('Unesi valjanu godinu proizvodnje.')
    }
    return ''
  }
  if (rule === 'positive' && number <= 0) return t('Vrijednost mora biti veća od nule.')
  if (rule === 'nonnegative' && number < 0) return t('Vrijednost ne može biti negativna.')
  return ''
}

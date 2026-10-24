import { useState } from 'react'

const rules = {
  vehicleId: 'required', brand: 'required', model: 'required', fuel: 'required',
  date: 'required', category: 'required', description: 'required',
  year: 'positive', mileage: 'nonnegative', initialMileage: 'nonnegative',
  liters: 'positive', unitPrice: 'positive', price: 'positive', amount: 'positive',
}

export default function useFieldValidation(t) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function validate(name, value) {
    const rule = rules[name]
    if (!rule) return ''
    const trimmed = String(value ?? '').trim()
    if (!trimmed) return t('Obavezno polje.')
    if (rule === 'positive' && (!Number.isFinite(Number(trimmed)) || Number(trimmed) <= 0)) return t('Vrijednost mora biti veća od nule.')
    if (rule === 'nonnegative' && (!Number.isFinite(Number(trimmed)) || Number(trimmed) < 0)) return t('Vrijednost ne može biti negativna.')
    if (name === 'year' && (!Number.isInteger(Number(trimmed)) || Number(trimmed) < 1885 || Number(trimmed) > new Date().getFullYear() + 1)) return t('Unesi valjanu godinu proizvodnje.')
    return ''
  }

  function onBlur(event) {
    const { name, value } = event.target
    if (!rules[name]) return
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: validate(name, value) }))
  }

  function onChange(event) {
    const { name, value } = event.target
    if (!rules[name] || !touched[name]) return
    setErrors((current) => ({ ...current, [name]: validate(name, value) }))
  }

  function clear() {
    setErrors({})
    setTouched({})
  }

  return { errors, onBlur, onChange, clear }
}

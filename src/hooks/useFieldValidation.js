import { useState } from 'react'
import { validateGarageField } from '../utils/fieldValidationRules'

export default function useFieldValidation(t) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function onBlur(event) {
    const { name, value } = event.target
    const message = validateGarageField(name, value, t)
    if (!name) return
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: message }))
  }

  function onChange(event) {
    const { name, value } = event.target
    if (!touched[name]) return
    setErrors((current) => ({ ...current, [name]: validateGarageField(name, value, t) }))
  }

  function clear() {
    setErrors({})
    setTouched({})
  }

  return { errors, onBlur, onChange, clear }
}


const STORAGE_KEYS = {
  vehicles: 'vehicles',
  services: 'services',
  fuelRecords: 'fuelRecords',
  expenses: 'expenses',
  reminders: 'reminders',
}

export function loadData(key) {
  const storageKey = STORAGE_KEYS[key]

  if (!storageKey) {
    throw new Error(`Nepoznat ključ za pohranu: ${key}`)
  }

  try {
    const savedData = localStorage.getItem(storageKey)

    if (savedData === null) {
      return []
    }

    const parsedData = JSON.parse(savedData)

    return Array.isArray(parsedData) ? parsedData : []
  } catch (error) {
    console.error(
      `Učitavanje podataka nije uspjelo (${storageKey}):`,
      error,
    )

    return []
  }
}

export function saveData(key, data) {
  const storageKey = STORAGE_KEYS[key]

  if (!storageKey) {
    throw new Error(`Nepoznat ključ za pohranu: ${key}`)
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(data),
    )
  } catch (error) {
    console.error(
      `Spremanje podataka nije uspjelo (${storageKey}):`,
      error,
    )

    throw error
  }
}
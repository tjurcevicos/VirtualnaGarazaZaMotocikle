
const STORAGE_KEYS = {
  vehicles: 'vehicles',
  services: 'services',
  fuelRecords: 'fuelRecords',
  expenses: 'expenses',
  reminders: 'reminders',
  maintenancePlans: 'maintenancePlans',
  registrationRecords: 'registrationRecords',
  trips: 'trips',
  serviceParts: 'serviceParts',
}

function getStorageKey(key, userId = null) {
  const storageKey = STORAGE_KEYS[key]

  if (!storageKey) {
    throw new Error(`Nepoznat ključ za pohranu: ${key}`)
  }

  if (userId === null || userId === undefined) {
    return storageKey
  }

  if (typeof userId !== 'string' || userId.trim() === '') {
    throw new Error('Neispravan identifikator korisnika.')
  }

  return `garage_${userId}_${storageKey}`
}

export function loadData(key, userId = null) {
  const storageKey = getStorageKey(key, userId)

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

export function saveData(key, data, userId = null) {
  const storageKey = getStorageKey(key, userId)

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

export function hasStoredData(key, userId = null) {
  const storageKey = getStorageKey(key, userId)

  return localStorage.getItem(storageKey) !== null
}

export function transferLegacyData(userId) {
  getStorageKey('vehicles', userId)

  const entries = Object.keys(STORAGE_KEYS).map((key) => {
    const targetKey = getStorageKey(key, userId)
    const existingTarget = localStorage.getItem(targetKey)

    if (existingTarget !== null) {
      throw new Error(
        `Korisnička pohrana već postoji (${targetKey}).`,
      )
    }

    return {
      targetKey,
      data: loadData(key),
    }
  })

  const writtenKeys = []

  try {
    for (const entry of entries) {
      localStorage.setItem(
        entry.targetKey,
        JSON.stringify(entry.data),
      )

      writtenKeys.push(entry.targetKey)
    }
  } catch (error) {
    for (const key of writtenKeys) {
      localStorage.removeItem(key)
    }

    throw error
  }
}
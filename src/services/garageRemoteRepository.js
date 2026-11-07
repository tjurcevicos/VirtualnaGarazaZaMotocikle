import { garageApiRequest } from './garageApiClient'

const COLLECTIONS = new Set([
  'vehicles',
  'services',
  'fuelRecords',
  'expenses',
  'reminders',
  'maintenancePlans',
  'registrationRecords',
  'trips',
  'serviceParts',
])

function collectionPath(collection, userId) {
  if (!COLLECTIONS.has(collection)) throw new Error('Nepoznata zbirka podataka.')
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Za udaljeni pristup potreban je korisnički identifikator.')
  }
  return `/users/${encodeURIComponent(userId)}/${collection}`
}

export const garageRemoteRepository = {
  async load(collection, userId, options = {}) {
    const records = await garageApiRequest(collectionPath(collection, userId), options)
    if (!Array.isArray(records)) throw new Error('Neispravan odgovor za zbirku podataka.')
    return records
  },
  async save(collection, records, userId, options = {}) {
    if (!Array.isArray(records)) throw new Error('Očekuje se polje zapisa.')
    return garageApiRequest(collectionPath(collection, userId), {
      ...options,
      method: 'PUT',
      body: records,
    })
  },
}

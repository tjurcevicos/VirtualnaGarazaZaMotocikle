import { loadData, saveData } from '../utils/storageFacade'
import { garageRemoteRepository } from './garageRemoteRepository'

export const GARAGE_DATA_SOURCES = Object.freeze({
  LOCAL: 'local',
  REMOTE: 'remote',
})

export const GARAGE_COLLECTIONS = Object.freeze([
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

function validateCollection(collection) {
  if (!GARAGE_COLLECTIONS.includes(collection)) {
    throw new Error(`Nepoznata zbirka podataka: ${collection}`)
  }
}

const localDataSource = {
  load(collection, userId) {
    validateCollection(collection)
    return loadData(collection, userId)
  },
  save(collection, records, userId) {
    validateCollection(collection)
    if (!Array.isArray(records)) throw new Error('Očekuje se polje zapisa.')
    return saveData(collection, records, userId)
  },
}

export function getGarageDataSource(source = GARAGE_DATA_SOURCES.LOCAL) {
  if (source === GARAGE_DATA_SOURCES.LOCAL) return localDataSource
  if (source === GARAGE_DATA_SOURCES.REMOTE) return garageRemoteRepository
  throw new Error(`Nepoznat izvor podataka: ${source}`)
}

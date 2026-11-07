import { loadData, saveData } from '../utils/storageFacade'
import { garageRemoteRepository } from './garageRemoteRepository'

export const garageRepository = {
  load(collection, userId) {
    return loadData(collection, userId)
  },
  save(collection, records, userId) {
    return saveData(collection, records, userId)
  },
  async loadAsync(collection, userId, options = {}) {
    if (options.source === 'remote') {
      return garageRemoteRepository.load(collection, userId, options)
    }
    return loadData(collection, userId)
  },
  async saveAsync(collection, records, userId, options = {}) {
    if (options.source === 'remote') {
      return garageRemoteRepository.save(collection, records, userId, options)
    }
    return saveData(collection, records, userId)
  },
}

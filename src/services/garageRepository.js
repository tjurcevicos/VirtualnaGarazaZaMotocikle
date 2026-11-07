import { loadData, saveData } from '../utils/storageFacade'

export const garageRepository = {
  load(collection, userId) {
    return loadData(collection, userId)
  },
  save(collection, records, userId) {
    return saveData(collection, records, userId)
  },
}

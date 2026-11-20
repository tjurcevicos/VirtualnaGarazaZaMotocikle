import { GARAGE_DATA_SOURCES, getGarageDataSource } from './garageDataSource'

export const garageRepository = {
  load(collection, userId) {
    return getGarageDataSource(GARAGE_DATA_SOURCES.LOCAL).load(collection, userId)
  },
  save(collection, records, userId) {
    return getGarageDataSource(GARAGE_DATA_SOURCES.LOCAL).save(collection, records, userId)
  },
  async loadAsync(collection, userId, options = {}) {
    const { source = GARAGE_DATA_SOURCES.LOCAL, ...requestOptions } = options
    return getGarageDataSource(source).load(collection, userId, requestOptions)
  },
  async saveAsync(collection, records, userId, options = {}) {
    const { source = GARAGE_DATA_SOURCES.LOCAL, ...requestOptions } = options
    return getGarageDataSource(source).save(collection, records, userId, requestOptions)
  },
}

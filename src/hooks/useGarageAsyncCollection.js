import { useCallback, useEffect, useState } from 'react'
import { garageRepository } from '../services/garageRepository'

export default function useGarageAsyncCollection(collection, userId, options = {}) {
  const { source = 'local', token } = options
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setLoading(true)
    setError(null)

    garageRepository.loadAsync(collection, userId, {
      source,
      token,
      signal: controller.signal,
    }).then((result) => {
      if (active) setRecords(result)
    }).catch((failure) => {
      if (active && failure?.name !== 'AbortError') setError(failure)
    }).finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
      controller.abort()
    }
  }, [collection, userId, source, token, refreshKey])

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), [])

  const save = useCallback(async (nextRecords) => {
    setError(null)
    try {
      await garageRepository.saveAsync(collection, nextRecords, userId, { source, token })
      setRecords(nextRecords)
    } catch (failure) {
      setError(failure)
      throw failure
    }
  }, [collection, userId, source, token])

  return { records, loading, error, refresh, save }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { garageRepository } from '../services/garageRepository'

export default function useGarageAsyncCollection(collection, userId, options = {}) {
  const { source = 'local', token } = options
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const requestId = useRef(0)
  const saveId = useRef(0)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const currentRequest = ++requestId.current
    setLoading(true)
    setError(null)
    setRecords([])

    garageRepository.loadAsync(collection, userId, {
      source,
      token,
      signal: controller.signal,
    }).then((result) => {
      if (!controller.signal.aborted && currentRequest === requestId.current) setRecords(result)
    }).catch((failure) => {
      if (!controller.signal.aborted && currentRequest === requestId.current && failure?.name !== 'AbortError') setError(failure)
    }).finally(() => {
      if (!controller.signal.aborted && currentRequest === requestId.current) setLoading(false)
    })

    return () => {
      controller.abort()
      requestId.current += 1
    }
  }, [collection, userId, source, token, refreshKey])

  const refresh = useCallback(() => setRefreshKey((current) => current + 1), [])

  const save = useCallback(async (nextRecords) => {
    const currentSave = ++saveId.current
    setSaving(true)
    setError(null)
    try {
      await garageRepository.saveAsync(collection, nextRecords, userId, { source, token })
      if (mounted.current && currentSave === saveId.current) setRecords(nextRecords)
    } catch (failure) {
      if (mounted.current && currentSave === saveId.current) setError(failure)
      throw failure
    } finally {
      if (mounted.current && currentSave === saveId.current) setSaving(false)
    }
  }, [collection, userId, source, token])

  return { records, loading, saving, error, refresh, save }
}

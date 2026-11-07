const API_BASE_URL = (import.meta.env.VITE_GARAGE_API_URL || '').replace(/\/$/, '')

export function isGarageApiConfigured() {
  return Boolean(API_BASE_URL)
}

export async function garageApiRequest(path, { method = 'GET', body, signal, token } = {}) {
  if (!API_BASE_URL) {
    throw new Error('Adresa backend API-ja nije konfigurirana.')
  }

  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'omit',
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new Error('Nije moguće povezati se s poslužiteljem.', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Poslužitelj je vratio pogrešku ${response.status}.`)
  }

  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Poslužitelj nije vratio očekivani JSON odgovor.')
  }
  return response.json()
}

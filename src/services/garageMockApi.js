const API_URL = `${import.meta.env.BASE_URL}mock-api/garage-tips.json`

export async function fetchGarageTips({ signal } = {}) {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  if (!data || !Array.isArray(data.tips) || !data.tips.every((tip) =>
    typeof tip.id === 'string' && typeof tip.title === 'string' && typeof tip.description === 'string'
  )) {
    throw new Error('Invalid mock API response')
  }

  return data.tips
}

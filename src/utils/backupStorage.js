import { loadData, saveData } from './storageFacade'

const keys = ['vehicles', 'services', 'fuelRecords', 'expenses', 'reminders', 'maintenancePlans', 'registrationRecords', 'trips']
const dbName = 'VirtualnaGarazaDB'
const storeName = 'motorcyclePhotos'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function readPhoto(db, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function dataUrlToBlob(value) {
  const match = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(value)
  if (!match) throw new Error('Fotografija u sigurnosnoj kopiji nije ispravna.')
  const binary = match[2] ? atob(match[3]) : decodeURIComponent(match[3])
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new Blob([bytes], { type: match[1] || 'application/octet-stream' })
}

function photoKey(userId, vehicleId) {
  return `garage_${userId}_${vehicleId}`
}

async function collectPhotos(userId, vehicles) {
  const db = await openDatabase()
  const photos = {}
  try {
    for (const vehicle of vehicles) {
      const key = photoKey(userId, vehicle.id)
      let photo = await readPhoto(db, key)
      if (!photo) photo = await readPhoto(db, vehicle.id)
      if (photo) photos[String(vehicle.id)] = await blobToDataUrl(photo)
    }
  } finally {
    db.close()
  }
  return photos
}

function writePhotos(userId, vehicles, photos) {
  return openDatabase().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    for (const vehicle of vehicles) {
      store.delete(photoKey(userId, vehicle.id))
      const data = photos[String(vehicle.id)]
      if (data) store.put(dataUrlToBlob(data), photoKey(userId, vehicle.id))
    }
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
  }))
}

export async function createBackup(userId) {
  const data = Object.fromEntries(keys.map((key) => [key, loadData(key, userId)]))
  const photos = await collectPhotos(userId, data.vehicles)
  return { format: 'virtualna-garaza-backup', version: 1, exportedAt: new Date().toISOString(), data, photos }
}

export function validateBackup(backup) {
  if (!backup || backup.format !== 'virtualna-garaza-backup' || backup.version !== 1 || !backup.data || typeof backup.data !== 'object') {
    throw new Error('Odabrana datoteka nije podržana sigurnosna kopija Virtualne garaže.')
  }
  for (const key of keys) {
    if (['maintenancePlans', 'registrationRecords', 'trips'].includes(key) && backup.data[key] === undefined) continue
    if (!Array.isArray(backup.data[key]) || backup.data[key].some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
      throw new Error(`Neispravni podaci u kategoriji: ${key}.`)
    }
  }
  if (!backup.photos || typeof backup.photos !== 'object' || Array.isArray(backup.photos)) throw new Error('Neispravni podaci fotografija.')
  const vehicleIds = new Set(backup.data.vehicles.map((vehicle) => String(vehicle.id)))
  for (const [id, value] of Object.entries(backup.photos)) {
    if (!vehicleIds.has(id) || typeof value !== 'string' || !value.startsWith('data:image/')) throw new Error('Sigurnosna kopija sadrži neispravnu fotografiju.')
  }
  return backup
}

export async function restoreBackup(userId, backup) {
  validateBackup(backup)
  const previous = await createBackup(userId)
  try {
    for (const key of keys) saveData(key, backup.data[key] ?? [], userId)
    await writePhotos(userId, [...previous.data.vehicles, ...backup.data.vehicles], backup.photos)
  } catch (error) {
    for (const key of keys) saveData(key, previous.data[key], userId)
    await writePhotos(userId, [...previous.data.vehicles, ...backup.data.vehicles], previous.photos)
    throw error
  }
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `virtualna-garaza-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

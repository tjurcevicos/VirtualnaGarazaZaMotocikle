const DB = 'VirtualnaGarazaGalerija'
const STORE = 'photos'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function transaction(mode, work) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const result = work(tx.objectStore(STORE))
    tx.oncomplete = () => { db.close(); resolve(result.value) }
    tx.onerror = () => { db.close(); reject(tx.error) }
    tx.onabort = () => { db.close(); reject(tx.error) }
  })
}

export async function getGallery(userId) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).getAll()
    request.onsuccess = () => resolve(request.result.filter((photo) => photo.userId === String(userId)))
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
    tx.onerror = () => { db.close(); reject(tx.error) }
  })
}

export async function saveGalleryPhoto(record) {
  return transaction('readwrite', (store) => { store.put(record); return { value: record.id } })
}

export async function removeGalleryPhoto(id) {
  return transaction('readwrite', (store) => { store.delete(id); return {} })
}

export async function deleteVehicleGallery(userId, vehicleId) {
  const photos = await getGallery(userId)
  return transaction('readwrite', (store) => {
    photos.filter((photo) => String(photo.vehicleId) === String(vehicleId)).forEach((photo) => store.delete(photo.id))
    return {}
  })
}

export async function replaceGallery(userId, records) {
  const old = await getGallery(userId)
  return transaction('readwrite', (store) => {
    old.forEach((photo) => store.delete(photo.id))
    records.forEach((photo) => store.put({ ...photo, userId: String(userId) }))
    return {}
  })
}

export function optimizePhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Obrada fotografije nije uspjela.')), 'image/webp', 0.78)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Fotografija se ne može otvoriti.')) }
    img.src = url
  })
}

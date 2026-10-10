const DB_NAME = 'VirtualnaGarazaDB'
const STORE_NAME = 'motorcyclePhotos'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function savePhoto(id, file) {
  if (!file) return

  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readwrite',
    )

    transaction.objectStore(STORE_NAME).put(file, id)

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export async function getPhoto(id) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readonly',
    )

    const request = transaction.objectStore(STORE_NAME).get(id)

    request.onsuccess = () => {
      const file = request.result

      database.close()
      resolve(file ? URL.createObjectURL(file) : null)
    }

    request.onerror = () => {
      database.close()
      reject(request.error)
    }
  })
}

export async function deletePhoto(id) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readwrite',
    )

    transaction.objectStore(STORE_NAME).delete(id)

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }
  })
}
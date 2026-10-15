
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

function getActiveUserId() {
  return localStorage.getItem('garage_active_user') || null
}

function getPhotoKey(id, userId = null) {
  if (userId === null || userId === undefined) {
    return id
  }

  if (typeof userId !== 'string' || userId.trim() === '') {
    throw new Error('Neispravan identifikator korisnika.')
  }

  return `garage_${userId}_${id}`
}

function isLegacyOwner(userId) {
  if (!userId) {
    return false
  }

  try {
    const savedUsers = localStorage.getItem('garage_users')

    if (!savedUsers) {
      return false
    }

    const users = JSON.parse(savedUsers)

    return (
      Array.isArray(users) &&
      users.length > 0 &&
      users[0].id === userId
    )
  } catch (error) {
    console.error(
      'Provjera vlasnika fotografija nije uspjela:',
      error,
    )

    return false
  }
}

export async function savePhoto(
  id,
  file,
  userId = getActiveUserId(),
) {
  if (!file) {
    return
  }

  const photoKey = getPhotoKey(id, userId)
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readwrite',
    )

    transaction.objectStore(STORE_NAME).put(
      file,
      photoKey,
    )

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export async function getPhoto(
  id,
  userId = getActiveUserId(),
) {
  const photoKey = getPhotoKey(id, userId)
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readonly',
    )

    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(photoKey)

    let photoFile = null

    request.onsuccess = () => {
      photoFile = request.result || null

      if (photoFile || !isLegacyOwner(userId)) {
        return
      }

      const legacyRequest = store.get(id)

      legacyRequest.onsuccess = () => {
        photoFile = legacyRequest.result || null
      }
    }

    transaction.oncomplete = () => {
      database.close()

      try {
        resolve(
          photoFile
            ? URL.createObjectURL(photoFile)
            : null,
        )
      } catch (error) {
        reject(error)
      }
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}

export async function deletePhoto(
  id,
  userId = getActiveUserId(),
) {
  const photoKey = getPhotoKey(id, userId)
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      STORE_NAME,
      'readwrite',
    )

    const store = transaction.objectStore(STORE_NAME)

    store.delete(photoKey)

    if (isLegacyOwner(userId)) {
      store.delete(id)
    }

    transaction.oncomplete = () => {
      database.close()
      resolve()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    transaction.onabort = () => {
      database.close()
      reject(transaction.error)
    }
  })
}
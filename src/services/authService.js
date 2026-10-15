
import { transferLegacyData } from '../utils/storageFacade'

const USERS_KEY = 'garage_users'
const SESSION_KEY = 'garage_active_user'
const LEGACY_TRANSFER_KEY = 'garage_legacy_transferred'

function getUsers() {
  try {
    const savedUsers = localStorage.getItem(USERS_KEY)

    if (!savedUsers) {
      return []
    }

    const users = JSON.parse(savedUsers)

    return Array.isArray(users) ? users : []
  } catch (error) {
    console.error('Učitavanje korisnika nije uspjelo:', error)
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  )
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Lozinka mora imati najmanje 8 znakova.')
  }
}

function getPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

function createUserId() {
  return crypto.randomUUID()
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(`${salt}:${password}`)

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    passwordData,
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function registerUser(name, email, password) {
  const cleanName = typeof name === 'string'
    ? name.trim()
    : ''

  const cleanEmail = typeof email === 'string'
    ? normalizeEmail(email)
    : ''

  if (cleanName.length < 2) {
    throw new Error('Ime mora imati najmanje 2 znaka.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Unesi ispravnu e-mail adresu.')
  }

  validatePassword(password)

  const users = getUsers()

  if (users.some((user) => user.email === cleanEmail)) {
    throw new Error('Korisnik s ovom e-mail adresom već postoji.')
  }

  const salt = crypto.randomUUID()
  const passwordHash = await hashPassword(password, salt)

  const newUser = {
    id: createUserId(),
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  }

  const shouldTransferLegacyData =
    users.length === 0 &&
    localStorage.getItem(LEGACY_TRANSFER_KEY) !== 'true'

  if (shouldTransferLegacyData) {
    transferLegacyData(newUser.id)
  }

  saveUsers([...users, newUser])

  if (shouldTransferLegacyData) {
    localStorage.setItem(LEGACY_TRANSFER_KEY, 'true')
  }

  localStorage.setItem(SESSION_KEY, newUser.id)

  return getPublicUser(newUser)
}

export async function loginUser(email, password) {
  const cleanEmail = typeof email === 'string'
    ? normalizeEmail(email)
    : ''

  if (typeof password !== 'string') {
    throw new Error('Neispravni podaci za prijavu.')
  }

  const users = getUsers()

  const user = users.find(
    (item) => item.email === cleanEmail,
  )

  if (!user) {
    throw new Error('Neispravna e-mail adresa ili lozinka.')
  }

  const passwordHash = await hashPassword(
    password,
    user.salt,
  )

  if (passwordHash !== user.passwordHash) {
    throw new Error('Neispravna e-mail adresa ili lozinka.')
  }

  localStorage.setItem(SESSION_KEY, user.id)

  return getPublicUser(user)
}

export function getCurrentUser() {
  const userId = localStorage.getItem(SESSION_KEY)

  if (!userId) {
    return null
  }

  const users = getUsers()

  const user = users.find(
    (item) => item.id === userId,
  )

  if (!user) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return getPublicUser(user)
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}
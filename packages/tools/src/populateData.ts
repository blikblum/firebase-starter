import { initializeApp } from 'firebase-admin/app'
import { getAuth, type UpdateRequest } from 'firebase-admin/auth'


process.env.GCLOUD_PROJECT = 'demo-no-project'

type SeedUser = {
  uid: string
  email: string
  displayName: string
  password: string
  emailVerified?: boolean
  customClaims?: Record<string, unknown>
}

const seedUsers: SeedUser[] = [
  {
    uid: 'user_alice',
    email: 'alice@example.com',
    displayName: 'Alice Rivera',
    password: 'password123',
    emailVerified: true,
  },
  {
    uid: 'user_ben',
    email: 'ben@example.com',
    displayName: 'Ben Nogueira',
    password: 'password123',
    emailVerified: true,
    customClaims: { manager: true },
  },
  {
    uid: 'user_chris',
    email: 'chris@example.com',
    displayName: 'Chris Martins',
    password: 'password123',
  },
]

function ensureAuthEmulatorHost(): string {
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
  }

  return process.env.FIREBASE_AUTH_EMULATOR_HOST
}

function getProjectId(): string {
  return process.env.FIREBASE_PROJECT_ID ?? 'demo-no-project'
}

function isFirebaseError(error: unknown): error is { code?: string } {
  return typeof error === 'object' && error !== null && 'code' in error
}

async function resolveExistingUid(auth: ReturnType<typeof getAuth>, user: SeedUser) {
  try {
    return (await auth.getUser(user.uid)).uid
  } catch {
    // Ignore missing user.
  }

  try {
    return (await auth.getUserByEmail(user.email)).uid
  } catch {
    return null
  }
}

async function maybeSetCustomClaims(
  auth: ReturnType<typeof getAuth>,
  uid: string,
  user: SeedUser,
) {
  if (!user.customClaims) {
    return
  }

  await auth.setCustomUserClaims(uid, user.customClaims)
}

async function upsertUser(auth: ReturnType<typeof getAuth>, user: SeedUser) {
  const { customClaims: _customClaims, ...userData } = user

  try {
    const created = await auth.createUser(userData)
    await maybeSetCustomClaims(auth, created.uid, user)
    return 'created'
  } catch (error) {
    if (!isFirebaseError(error)) {
      throw error
    }

    if (error.code !== 'auth/email-already-exists' && error.code !== 'auth/uid-already-exists') {
      throw error
    }

    const existingUid = await resolveExistingUid(auth, user)
    if (!existingUid) {
      throw error
    }

    const update: UpdateRequest = {
      email: user.email,
      displayName: user.displayName,
      password: user.password,
      emailVerified: user.emailVerified,
    }

    await auth.updateUser(existingUid, update)
    await maybeSetCustomClaims(auth, existingUid, user)
    return 'updated'
  }
}

async function main() {
  const emulatorHost = ensureAuthEmulatorHost()
  const projectId = getProjectId()

  initializeApp({ projectId })

  const auth = getAuth()

  console.log(`[tools] Using Firebase Auth emulator at ${emulatorHost}`)
  console.log(`[tools] Seeding users into project "${projectId}"`)

  for (const user of seedUsers) {
    const action = await upsertUser(auth, user)
    console.log(`[tools] ${action}: ${user.email}`)
  }
}

main().catch((error) => {
  console.error('[tools] Failed to populate data', error)
  process.exitCode = 1
})

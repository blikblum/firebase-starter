import { initializeApp } from 'firebase-admin/app'
import { getAuth, type UpdateRequest } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { createMovieDocument, type MovieInput } from 'base/movies'


process.env.GCLOUD_PROJECT = 'demo-no-project'

type SeedUser = {
  uid: string
  email: string
  displayName: string
  password: string
  emailVerified?: boolean
  customClaims?: Record<string, unknown>
}

type SeedMovie = MovieInput & {
  id: string
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

const seedMoviesByUser: Record<string, SeedMovie[]> = {
  user_alice: [
    {
      id: 'arrival',
      title: 'Arrival',
      releaseYear: 2016,
      director: 'Denis Villeneuve',
      genres: ['Drama', 'Sci-Fi'],
      runtimeMinutes: 116,
      posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
      rating: 9,
      watched: true,
      summary: 'A linguist works with the military to communicate with alien visitors.',
      notes: 'Rewatch for the sound design and structure.',
    },
    {
      id: 'spirited-away',
      title: 'Spirited Away',
      releaseYear: 2001,
      director: 'Hayao Miyazaki',
      genres: ['Animation', 'Adventure', 'Fantasy'],
      runtimeMinutes: 125,
      posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
      rating: 10,
      watched: true,
      summary: 'A young girl enters a spirit world and works to free her parents.',
      notes: 'Good family night pick.',
    },
  ],
  user_ben: [
    {
      id: 'the-batman',
      title: 'The Batman',
      releaseYear: 2022,
      director: 'Matt Reeves',
      genres: ['Crime', 'Drama', 'Mystery'],
      runtimeMinutes: 176,
      posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
      rating: 8,
      watched: true,
      summary: 'Batman investigates corruption while tracking a serial killer in Gotham.',
      notes: 'Use as a reference for noir mood.',
    },
    {
      id: 'dune-part-two',
      title: 'Dune: Part Two',
      releaseYear: 2024,
      director: 'Denis Villeneuve',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      runtimeMinutes: 166,
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      rating: 9,
      watched: true,
      summary: 'Paul Atreides unites with Chani and the Fremen while seeking revenge.',
      notes: 'Large-screen rewatch.',
    },
  ],
  user_chris: [
    {
      id: 'past-lives',
      title: 'Past Lives',
      releaseYear: 2023,
      director: 'Celine Song',
      genres: ['Drama', 'Romance'],
      runtimeMinutes: 106,
      posterUrl: 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
      rating: 8.5,
      watched: false,
      summary: 'Two childhood friends reconnect decades later in New York.',
      notes: 'Watch this weekend.',
    },
  ],
}

function ensureAuthEmulatorHost(): string {
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
  }

  return process.env.FIREBASE_AUTH_EMULATOR_HOST
}

function ensureFirestoreEmulatorHost(): string {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
  }

  return process.env.FIRESTORE_EMULATOR_HOST
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
    return { action: 'created', uid: created.uid }
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
    return { action: 'updated', uid: existingUid }
  }
}

async function seedMovies(user: SeedUser, uid: string): Promise<void> {
  const firestore = getFirestore()
  const seedMovies = seedMoviesByUser[user.uid] ?? []

  for (const [index, movie] of seedMovies.entries()) {
    const { id, ...movieInput } = movie
    const seededAt = new Date(Date.UTC(2026, 0, index + 1, 12))

    await firestore
      .collection('users')
      .doc(uid)
      .collection('movies')
      .doc(id)
      .set(createMovieDocument(movieInput, seededAt), { merge: true })

    console.log(`[tools] seeded movie for ${user.email}: ${movie.title}`)
  }
}

async function main() {
  const emulatorHost = ensureAuthEmulatorHost()
  const firestoreEmulatorHost = ensureFirestoreEmulatorHost()
  const projectId = getProjectId()

  initializeApp({ projectId })

  const auth = getAuth()

  console.log(`[tools] Using Firebase Auth emulator at ${emulatorHost}`)
  console.log(`[tools] Using Firestore emulator at ${firestoreEmulatorHost}`)
  console.log(`[tools] Seeding users into project "${projectId}"`)

  for (const user of seedUsers) {
    const { action, uid } = await upsertUser(auth, user)
    console.log(`[tools] ${action}: ${user.email}`)
    await seedMovies(user, uid)
  }
}

main().catch((error) => {
  console.error('[tools] Failed to populate data', error)
  process.exitCode = 1
})

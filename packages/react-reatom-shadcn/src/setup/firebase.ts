import { initializeApp } from 'firebase/app'
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore'
// import { getStorage, connectStorageEmulator } from 'firebase/storage'
import {
  getAuth,
  connectAuthEmulator,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

import { firebaseConfig } from 'base/firebase.config'
import { initializeAuthSession } from '../stores/appSession.service'

const app = initializeApp(firebaseConfig)

const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})

function isRemoteDataEnabled(): boolean {
  return import.meta.env.VITE_REMOTE_DATA === 'true'
}

function isLocalhost(): boolean {
  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

export function shouldUseEmulators(): boolean {
  return isLocalhost() && !isRemoteDataEnabled()
}

const auth = getAuth()

if (shouldUseEmulators()) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
}

const browserPersistence = import.meta.env.DEV
  ? browserLocalPersistence
  : browserSessionPersistence

async function initializeAuthentication(): Promise<void> {
  try {
    await setPersistence(auth, browserPersistence)
  } catch (error) {
    console.error('Unable to configure Firebase Auth persistence.', error)
  }

  await initializeAuthSession()
}

void initializeAuthentication()

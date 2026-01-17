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
import { listenToAuthStateChanges } from '../stores/appSession.service'

const app = initializeApp(firebaseConfig)

const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})

function isRemoteDataEnabled() {
  return import.meta.env.VITE_REMOTE_DATA === 'true'
}

if (window.location.hostname === 'localhost' && !isRemoteDataEnabled()) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
  connectAuthEmulator(getAuth(), 'http://localhost:9099', { disableWarnings: true })
} else {
  const browserPersistence = import.meta.env.DEV
    ? browserLocalPersistence
    : browserSessionPersistence
  setPersistence(getAuth(), browserPersistence)
}

listenToAuthStateChanges()

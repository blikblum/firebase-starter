import type { UserProfile, UserProfileInput } from 'base/user-profile'
import { userProfileInputSchema, userProfileSchema } from 'base/user-profile'
import { FirebaseError } from 'firebase/app'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  Timestamp,
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type DocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'

import { appSessionAtom } from './appSession'
import { initialUserProfileState, userProfileAtom } from './userProfile'

let activeProfileUnsubscribe: Unsubscribe | undefined

function errorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return 'Your profile could not be accessed with the current account.'
      case 'unavailable':
        return 'Unable to reach Firestore. Check your connection and try again.'
      case 'unauthenticated':
        return 'Sign in again to access your profile.'
      default:
        return 'Unable to load or save your profile. Please try again.'
    }
  }

  return error instanceof Error ? error.message : `${error}`
}

function toIsoTimestamp(value: unknown, fieldName: string): string {
  if (!(value instanceof Timestamp)) {
    throw new Error(`User profile contains an invalid ${fieldName}.`)
  }

  return value.toDate().toISOString()
}

function toUserProfile(snapshot: DocumentSnapshot<DocumentData>): UserProfile {
  const data = snapshot.data({ serverTimestamps: 'estimate' })

  if (!data) {
    throw new Error('User profile data is missing.')
  }

  const result = userProfileSchema.safeParse({
    id: snapshot.id,
    name: data.name,
    email: data.email,
    createdAt: toIsoTimestamp(data.createdAt, 'createdAt'),
    updatedAt: toIsoTimestamp(data.updatedAt, 'updatedAt'),
  })

  if (!result.success) {
    throw new Error('User profile contains invalid data.', { cause: result.error })
  }

  return result.data
}

export function resetUserProfile(): void {
  activeProfileUnsubscribe?.()
  activeProfileUnsubscribe = undefined
  userProfileAtom.set(initialUserProfileState)
}

export function listenToCurrentUserProfile(): Unsubscribe {
  activeProfileUnsubscribe?.()

  const user = getAuth().currentUser

  if (!user) {
    userProfileAtom.set(initialUserProfileState)
    return () => undefined
  }

  userProfileAtom.set({
    data: undefined,
    loading: true,
    missing: false,
    error: undefined,
  })

  const profileRef = doc(getFirestore(), 'users', user.uid)
  const unsubscribe = onSnapshot(profileRef, {
    next(snapshot) {
      if (!snapshot.exists()) {
        userProfileAtom.set({
          data: undefined,
          loading: false,
          missing: true,
          error: undefined,
        })
        return
      }

      try {
        userProfileAtom.set({
          data: toUserProfile(snapshot),
          loading: false,
          missing: false,
          error: undefined,
        })
      } catch (error) {
        userProfileAtom.set({
          data: undefined,
          loading: false,
          missing: false,
          error: errorMessage(error),
        })
      }
    },
    error(error) {
      userProfileAtom.set({
        data: undefined,
        loading: false,
        missing: false,
        error: errorMessage(error),
      })
    },
  })

  activeProfileUnsubscribe = unsubscribe

  return () => {
    if (activeProfileUnsubscribe === unsubscribe) {
      activeProfileUnsubscribe = undefined
    }
    unsubscribe()
  }
}

export async function completeOnboarding(
  input: UserProfileInput,
): Promise<boolean> {
  const user = getAuth().currentUser

  if (!user?.email) {
    userProfileAtom.set((state) => ({
      ...state,
      loading: false,
      error: 'You must be signed in with an email address to finish setup.',
    }))
    return false
  }

  if (!user.emailVerified) {
    userProfileAtom.set((state) => ({
      ...state,
      loading: false,
      error: 'Verify your email address before finishing setup.',
    }))
    return false
  }

  const inputResult = userProfileInputSchema.safeParse(input)

  if (!inputResult.success) {
    userProfileAtom.set((state) => ({
      ...state,
      loading: false,
      error: inputResult.error.issues[0]?.message ?? 'Check your profile details.',
    }))
    return false
  }

  if (inputResult.data.email !== user.email) {
    userProfileAtom.set((state) => ({
      ...state,
      loading: false,
      error: 'Your profile email must match the signed-in account.',
    }))
    return false
  }

  userProfileAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  try {
    await updateProfile(user, { displayName: inputResult.data.name })

    const profileRef = doc(getFirestore(), 'users', user.uid)

    await runTransaction(getFirestore(), async (transaction) => {
      const existingProfile = await transaction.get(profileRef)

      if (existingProfile.exists()) {
        return
      }

      transaction.set(profileRef, {
        ...inputResult.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    })

    appSessionAtom.set((session) => ({
      ...session,
      user: session.user
        ? {
            ...session.user,
            name: inputResult.data.name,
          }
        : undefined,
    }))

    return true
  } catch (error) {
    userProfileAtom.set((state) => ({
      ...state,
      loading: false,
      error: errorMessage(error),
    }))
    return false
  }
}

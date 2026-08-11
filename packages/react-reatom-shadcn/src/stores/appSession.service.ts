import type { SignInInput, SignUpInput } from '../api/auth'
import { signInInputSchema, signUpInputSchema } from '../api/auth'
import type { AppUser, AppUserRole } from '../api/appUser'
import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut as authSignOut,
  type User,
} from 'firebase/auth'

import { appSessionAtom, emailVerificationStateAtom } from './appSession'
import { listenToCurrentUserProfile, resetUserProfile } from './userProfile.service'

let signOutReason: string | undefined
let redirectError: string | undefined
let profileUserId: string | undefined

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : `${error}`
  }

  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Sign in with its original method.'
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.'
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/network-request-failed':
      return 'Unable to reach Firebase. Check your connection and try again.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled for this Firebase project.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/weak-password':
      return 'Password must be at least 8 characters.'
    case 'auth/password-does-not-meet-requirements':
      return 'Password does not meet this Firebase project’s password requirements.'
    default:
      return 'Authentication failed. Please try again.'
  }
}

function setSigningState(isSigning: boolean, error?: string): void {
  appSessionAtom.set((session) => ({
    ...session,
    isSigning,
    error,
  }))
}

function resetEmailVerificationState(): void {
  emailVerificationStateAtom.set({
    isChecking: false,
    isSending: false,
    error: undefined,
    message: undefined,
  })
}

async function toAppUser(user: User, forceTokenRefresh = false): Promise<AppUser> {
  const idTokenResult = await user.getIdTokenResult(forceTokenRefresh)
  const roles: AppUserRole[] = []

  if (idTokenResult.claims.manager) {
    roles.push('manager')
  }
  if (idTokenResult.claims.owner) {
    roles.push('owner')
  }

  return {
    id: user.uid,
    email: user.email ?? '',
    name: user.displayName ?? '',
    emailVerified: user.emailVerified,
    roles,
  }
}

async function syncSignedInUser(user: User, forceTokenRefresh = false): Promise<void> {
  const appUser = await toAppUser(user, forceTokenRefresh)

  if (profileUserId !== user.uid) {
    profileUserId = user.uid
    listenToCurrentUserProfile()
  }

  appSessionAtom.set({
    isAuthReady: true,
    isSigned: true,
    isSigning: false,
    error: undefined,
    user: appUser,
  })
}

export async function signIn(input: SignInInput): Promise<void> {
  const result = signInInputSchema.safeParse(input)

  if (!result.success) {
    setSigningState(false, result.error.issues[0]?.message ?? 'Check your credentials.')
    return
  }

  resetEmailVerificationState()
  setSigningState(true)

  try {
    await signInWithEmailAndPassword(getAuth(), result.data.email, result.data.password)
  } catch (error) {
    setSigningState(false, getAuthErrorMessage(error))
  }
}

export async function signUp(input: SignUpInput): Promise<void> {
  const result = signUpInputSchema.safeParse(input)

  if (!result.success) {
    setSigningState(false, result.error.issues[0]?.message ?? 'Check your account details.')
    return
  }

  setSigningState(true)
  resetEmailVerificationState()

  let user: User

  try {
    const credential = await createUserWithEmailAndPassword(
      getAuth(),
      result.data.email,
      result.data.password,
    )
    user = credential.user
  } catch (error) {
    setSigningState(false, getAuthErrorMessage(error))
    return
  }

  emailVerificationStateAtom.set({
    isChecking: false,
    isSending: true,
    error: undefined,
    message: undefined,
  })

  try {
    await sendEmailVerification(user)
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: undefined,
      message: `Verification email sent to ${user.email ?? result.data.email}.`,
    })
  } catch (error) {
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: getAuthErrorMessage(error),
      message: undefined,
    })
  } finally {
    setSigningState(false)
  }
}

export async function signInWithGoogle(): Promise<void> {
  resetEmailVerificationState()
  setSigningState(true)

  try {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(getAuth(), provider)
  } catch (error) {
    setSigningState(false, getAuthErrorMessage(error))
  }
}

export async function resendVerificationEmail(): Promise<void> {
  const user = getAuth().currentUser

  if (!user) {
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: 'Sign in before requesting another verification email.',
      message: undefined,
    })
    return
  }

  emailVerificationStateAtom.set({
    isChecking: false,
    isSending: true,
    error: undefined,
    message: undefined,
  })

  try {
    await sendEmailVerification(user)
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: undefined,
      message: `Verification email sent to ${user.email ?? 'your address'}.`,
    })
  } catch (error) {
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: getAuthErrorMessage(error),
      message: undefined,
    })
  }
}

export async function refreshEmailVerification(): Promise<boolean> {
  const user = getAuth().currentUser

  if (!user) {
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: 'Sign in before checking verification.',
      message: undefined,
    })
    return false
  }

  emailVerificationStateAtom.set({
    isChecking: true,
    isSending: false,
    error: undefined,
    message: undefined,
  })

  try {
    await reload(user)

    if (!user.emailVerified) {
      emailVerificationStateAtom.set({
        isChecking: false,
        isSending: false,
        error: undefined,
        message: 'Email is not verified yet. Open the link, then check again.',
      })
      return false
    }

    await syncSignedInUser(user, true)
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: undefined,
      message: 'Email verified.',
    })
    return true
  } catch (error) {
    emailVerificationStateAtom.set({
      isChecking: false,
      isSending: false,
      error: getAuthErrorMessage(error),
      message: undefined,
    })
    return false
  }
}

export async function signOut(reason?: string): Promise<void> {
  signOutReason = reason
  await authSignOut(getAuth())
}

export function listenToAuthStateChanges(): void {
  onAuthStateChanged(getAuth(), async (user) => {
    if (user) {
      try {
        await syncSignedInUser(user)
      } catch (error) {
        resetUserProfile()
        profileUserId = undefined
        appSessionAtom.set({
          isAuthReady: true,
          isSigned: false,
          isSigning: false,
          error: getAuthErrorMessage(error),
          user: undefined,
        })
      }
      return
    }

    resetUserProfile()
    resetEmailVerificationState()
    profileUserId = undefined
    appSessionAtom.set({
      isAuthReady: true,
      isSigned: false,
      isSigning: false,
      error: signOutReason ?? redirectError,
      user: undefined,
    })

    signOutReason = undefined
    redirectError = undefined
  })
}

export async function initializeAuthSession(): Promise<void> {
  try {
    await getRedirectResult(getAuth())
  } catch (error) {
    redirectError = getAuthErrorMessage(error)
  }

  listenToAuthStateChanges()
}

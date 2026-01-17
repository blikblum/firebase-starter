import { appSessionAtom } from './appSession'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as authSignOut,
} from 'firebase/auth'
import { AppUserRole } from '../api/appUser'

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<void> {
  try {
    appSessionAtom.set((appSession) => ({
      ...appSession,
      isSigning: true,
      error: undefined,
    }))

    const auth = getAuth()

    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    appSessionAtom.set((appSession) => ({
      ...appSession,
      isSigning: false,
      isSigned: false,
      user: undefined,
      error: `${error}`,
    }))
  }
}

let signOutReason: string | undefined

export async function signOut(reason?: string): Promise<void> {
  signOutReason = reason
  const auth = getAuth()
  await authSignOut(auth)
}

export function listenToAuthStateChanges(): void {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult()
      const manager = idTokenResult.claims?.manager
      if (!manager) {
        await signOut('Acesso não autorizado')

        return
      }

      const userRoles: AppUserRole[] = ['manager']
      if (idTokenResult.claims?.owner) {
        userRoles.push('owner')
      }

      appSessionAtom.set((appSession) => ({
        ...appSession,
        isSigning: false,
        isSigned: true,
        user: {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          roles: userRoles,
        },
        error: undefined,
      }))
    } else {
      appSessionAtom.set((appSession) => ({
        ...appSession,
        isSigning: false,
        isSigned: false,
        user: undefined,
        error: signOutReason,
      }))

      signOutReason = undefined
    }
  })
}

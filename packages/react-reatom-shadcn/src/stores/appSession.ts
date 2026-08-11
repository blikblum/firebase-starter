import { atom, computed } from '@reatom/core'
import { AppSession } from '../api/appSession'

export const appSessionAtom = atom<AppSession>(
  {
    isAuthReady: false,
    isSigned: false,
    isSigning: false,
    error: undefined,
    user: undefined,
  },
  'appSession',
)

export interface EmailVerificationState {
  isChecking: boolean
  isSending: boolean
  error?: string
  message?: string
}

export const emailVerificationStateAtom = atom<EmailVerificationState>(
  {
    isChecking: false,
    isSending: false,
    error: undefined,
    message: undefined,
  },
  'emailVerificationState',
)

export const isSignedAtom = computed(() => {
  return appSessionAtom().isSigned
}, 'isSigned')

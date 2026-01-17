import { atom, computed } from '@reatom/core'
import { AppSession } from '../api/appSession'

export const appSessionAtom = atom<AppSession>({
  isSigned: false,
  isSigning: false,
  error: undefined,
  user: undefined,
})

export const isSignedAtom = computed(() => {
  return appSessionAtom().isSigned
})

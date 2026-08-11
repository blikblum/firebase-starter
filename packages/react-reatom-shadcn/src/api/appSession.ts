import { AppUser } from './appUser'

export interface AppSession {
  isAuthReady: boolean
  isSigned: boolean
  isSigning: boolean
  error?: string
  user?: AppUser
}

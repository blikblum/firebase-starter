import { AppUser } from './appUser'

export interface AppSession {
  isSigned: boolean
  isSigning: boolean
  error?: string
  user?: AppUser
}

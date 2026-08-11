import { atom } from '@reatom/core'
import type { UserProfile } from 'base/user-profile'

export interface UserProfileState {
  data?: UserProfile
  loading: boolean
  missing: boolean
  error?: string
}

export const initialUserProfileState: UserProfileState = {
  data: undefined,
  loading: false,
  missing: false,
  error: undefined,
}

export const userProfileAtom = atom<UserProfileState>(
  initialUserProfileState,
  'userProfile',
)

import { AppUser } from '../api/appUser'
import { appSessionAtom } from './appSession'

export interface LoginPayload {
  email: string
  name: string
}

const LOGIN_DELAY_MS = 650

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function buildMockUser(payload: LoginPayload): AppUser {
  return {
    id: 'user-001',
    name: payload.name,
    email: payload.email,
    roles: ['owner'],
  }
}

export async function mockLogin(payload: LoginPayload): Promise<AppUser> {
  appSessionAtom.set((state) => ({
    ...state,
    isSigned: false,
    isSigning: true,
    error: undefined,
    user: undefined,
  }))

  await delay(LOGIN_DELAY_MS)

  const user = buildMockUser(payload)

  appSessionAtom.set({
    isSigned: true,
    isSigning: false,
    error: undefined,
    user,
  })

  return user
}

export type AppUserRole = 'owner' | 'manager'

export interface AppUser {
  id: string
  name: string
  email: string
  roles: AppUserRole[]
}

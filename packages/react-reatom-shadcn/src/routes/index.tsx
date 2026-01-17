import { createFileRoute } from '@tanstack/react-router'

import { ComponentExample } from '../components/component-example'
import { appSessionAtom } from '../stores/appSession'
import { useStore } from '../helpers/reatom'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
})

function toggleSignIn() {
  appSessionAtom.set((appSessionAtom) => ({
    ...appSessionAtom,
    isSigned: !appSessionAtom.isSigned,
    user: !appSessionAtom.isSigned
      ? { email: 'user@example.com', id: '123', name: 'User', roles: [] }
      : undefined,
  }))
}

export function AppState() {
  const session = useStore(appSessionAtom)
  return (
    <div>
      <div className="mb-4">
        {session.isSigned ? `Signed in as ${session.user?.email}` : 'Not signed in'}
      </div>
      <Button onClick={toggleSignIn}>{session.isSigned ? 'Sign Out' : 'Sign In'}</Button>
    </div>
  )
}

function App() {
  return AppState()
}

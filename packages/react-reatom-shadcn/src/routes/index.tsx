import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { ComponentExample } from '../components/component-example'
import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const session = useStore(appSessionAtom)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    if (!session.isSigned) {
      void navigate({ to: '/login' })
    }
  }, [navigate, session.isSigned])

  if (!session.isSigned) {
    return null
  }

  return ComponentExample()
}

import * as React from 'react'
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'

import type { AppShellLinkProps, AppShellNavItem } from '@/components/app-shell'
import { AppShell } from '@/components/app-shell'
import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'
import { signOut } from '@/stores/appSession.service'

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
})

const RouterLink = (props: AppShellLinkProps): React.JSX.Element => {
  return <Link {...props} />
}

function AppLayoutRoute(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  React.useEffect(() => {
    if (!session.isSigned) {
      void navigate({ to: '/login' })
    }
  }, [navigate, session.isSigned])

  if (!session.isSigned) {
    return null
  }

  const navItems: AppShellNavItem[] = [
    { label: 'Home', to: '/', isActive: pathname === '/' },
    { label: 'About', to: '/about', isActive: pathname === '/about' },
  ]

  return (
    <AppShell
      navItems={navItems}
      userName={session.user?.name ?? ''}
      userEmail={session.user?.email ?? ''}
      onSignOut={() => void signOut()}
      LinkComponent={RouterLink}
    >
      <Outlet />
    </AppShell>
  )
}

import * as React from 'react'
import { createFileRoute, Link, useNavigate, useRouterState } from '@tanstack/react-router'

import type { AppShellLinkProps, AppShellNavItem } from '@/components/app-shell'
import { AppShell } from '@/components/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'
import { signOut } from '@/stores/appSession.service'

export const Route = createFileRoute('/about')({
  component: AboutRoute,
})

const RouterLink = (props: AppShellLinkProps): React.JSX.Element => {
  return <Link {...props} />
}

function AboutRoute(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)
  const navigate = useNavigate({ from: Route.fullPath })
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
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">About</p>
          <h1 className="text-3xl font-semibold text-slate-900">About the app</h1>
        </div>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Firebase Starter</CardTitle>
            <CardDescription>Build on top of a fast, typed baseline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              This starter connects Firebase Auth with a lightweight Reatom store and
              Shadcn UI building blocks.
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>File-based routing with TanStack Router.</li>
              <li>Composable UI from Shadcn.</li>
              <li>Typed state management powered by Reatom.</li>
              <li>Firebase Auth emulator-friendly sign-in.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

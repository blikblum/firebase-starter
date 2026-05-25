import * as React from 'react'
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { HomeIcon, InfoIcon } from 'lucide-react'

import type {
  AppSidebarLinkProps,
  AppSidebarLinkRenderer,
  AppSidebarNavItem,
} from '@/components/app-sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { useStore } from '@/helpers/reatom'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { appSessionAtom } from '@/stores/appSession'
import { signOut } from '@/stores/appSession.service'

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
})

const RouterLink: AppSidebarLinkRenderer = (props: AppSidebarLinkProps): React.JSX.Element => {
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

  const navItems: AppSidebarNavItem[] = [
    { label: 'Home', to: '/', icon: <HomeIcon />, isActive: pathname === '/' },
    { label: 'About', to: '/about', icon: <InfoIcon />, isActive: pathname === '/about' },
  ]
  const activeNavItem = navItems.find((item) => item.isActive)

  return (
    <SidebarProvider>
      <AppSidebar
        navItems={navItems}
        userName={session.user?.name ?? ''}
        userEmail={session.user?.email ?? ''}
        onSignOut={() => void signOut()}
        renderLink={RouterLink}
        variant="inset"
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {activeNavItem?.label ?? 'Firebase Starter'}
            </p>
            <p className="truncate text-xs text-muted-foreground">Reatom + shadcn/ui</p>
          </div>
        </header>
        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

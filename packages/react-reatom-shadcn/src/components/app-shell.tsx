import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { LogOutIcon } from 'lucide-react'

export type AppShellNavItem = {
  label: string
  to: string
  isActive?: boolean
}

export type AppShellLinkProps = {
  to: string
  className?: string
  children: React.ReactNode
  'aria-current'?: 'page'
}

export type AppShellProps = {
  navItems: AppShellNavItem[]
  userName: string
  userEmail: string
  onSignOut: () => void
  children: React.ReactNode
  LinkComponent?: React.ComponentType<AppShellLinkProps>
}

const DefaultLink = ({
  to,
  className,
  children,
  ...props
}: AppShellLinkProps): React.JSX.Element => {
  return (
    <a className={className} href={to} {...props}>
      {children}
    </a>
  )
}

function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) {
    return '?'
  }

  const parts = trimmed.split(/\s+/)
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return initials || '?'
}

export function AppShell({
  navItems,
  userName,
  userEmail,
  onSignOut,
  children,
  LinkComponent = DefaultLink,
}: AppShellProps): React.JSX.Element {
  const initials = getInitials(userName)
  const displayName = userName.trim() || 'Signed in user'
  const displayEmail = userEmail.trim() || 'user@example.com'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-slate-950 text-slate-100 md:w-64 md:border-b-0 md:border-r">
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-lg font-semibold tracking-tight">Firebase Starter</p>
            <p className="text-xs text-slate-400">Reatom + Shadcn UI</p>
          </div>
          <nav className="flex gap-2 px-4 py-4 md:flex-col">
            {navItems.map((item) => {
              const linkClassName = cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                item.isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-900/60 hover:text-white',
              )

              return (
                <LinkComponent
                  key={item.to}
                  to={item.to}
                  className={linkClassName}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </LinkComponent>
              )
            })}
          </nav>
          <div className="mt-auto border-t border-slate-800 px-4 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-left text-slate-100 hover:bg-slate-900/70 hover:text-white"
                  />
                }
              >
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-white">{displayName}</span>
                  <span className="truncate text-xs text-slate-400">{displayEmail}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border border-slate-800 bg-slate-950 text-slate-100 shadow-xl"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-slate-400">Account</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="text-slate-100 hover:!bg-slate-800 hover:!text-white focus:!bg-slate-800 focus:!text-white data-[highlighted]:!bg-slate-800 data-[highlighted]:!text-white data-[variant=destructive]:text-rose-300 data-[variant=destructive]:focus:!bg-rose-900/40 data-[variant=destructive]:focus:!text-rose-200 data-[variant=destructive]:data-[highlighted]:!bg-rose-900/40 data-[variant=destructive]:data-[highlighted]:!text-rose-200"
                    variant="destructive"
                    onClick={() => {
                      console.log('Signing out...')
                      onSignOut()
                    }}
                  >
                    <LogOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
        <main className="flex-1 bg-slate-50 px-6 py-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

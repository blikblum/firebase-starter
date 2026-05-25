'use client'

import * as React from 'react'

import { NavMain, type AppSidebarLinkRenderer, type AppSidebarNavItem } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { GalleryVerticalEndIcon } from 'lucide-react'

export type {
  AppSidebarLinkProps,
  AppSidebarLinkRenderer,
  AppSidebarNavItem,
} from '@/components/nav-main'

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  navItems: AppSidebarNavItem[]
  userName: string
  userEmail: string
  onSignOut: () => void
  renderLink?: AppSidebarLinkRenderer
}

const defaultRenderLink: AppSidebarLinkRenderer = ({ to, ...props }) => {
  return <a href={to} {...props} />
}

export function AppSidebar({
  navItems,
  userName,
  userEmail,
  onSignOut,
  renderLink = defaultRenderLink,
  ...props
}: AppSidebarProps): React.JSX.Element {
  const homeDestination = navItems[0]?.to ?? '/'

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Firebase Starter"
              render={renderLink({ to: homeDestination })}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Firebase Starter</span>
                <span className="truncate text-xs">Reatom + shadcn/ui</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} renderLink={renderLink} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={{ name: userName, email: userEmail }} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

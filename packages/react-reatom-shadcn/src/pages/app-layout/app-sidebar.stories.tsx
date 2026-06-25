import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilmIcon, InfoIcon } from 'lucide-react'
import { fn } from 'storybook/test'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AppSidebar } from './app-sidebar'

const navItems = [
  { label: 'Movies', to: '/movies', icon: <FilmIcon />, isActive: true },
  { label: 'About', to: '/about', icon: <InfoIcon />, isActive: false },
]

const meta = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    navItems,
    onSignOut: fn(),
    userName: 'Ben Nogueira',
    userEmail: 'ben@example.com',
    variant: 'inset',
  },
  render: (args) => {
    const activeNavItem = args.navItems.find((item) => item.isActive)

    return (
      <SidebarProvider>
        <AppSidebar {...args} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-3 border-b bg-background/95 px-4">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {activeNavItem?.label ?? 'Firebase Starter'}
              </p>
              <p className="truncate text-xs text-muted-foreground">Reatom + shadcn/ui</p>
            </div>
          </header>
          <div className="p-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Starter Status</CardTitle>
                <CardDescription>
                  Storybook shell for the shadcn app sidebar migration.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Collapse the sidebar, switch the active route args, and open the footer account menu
                to exercise the migrated layout.
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  },
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AboutActive: Story = {
  args: {
    navItems: [
      { label: 'Movies', to: '/movies', icon: <FilmIcon />, isActive: false },
      { label: 'About', to: '/about', icon: <InfoIcon />, isActive: true },
    ],
  },
}

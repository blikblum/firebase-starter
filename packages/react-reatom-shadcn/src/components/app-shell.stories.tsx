import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fn } from 'storybook/test'

import type { AppShellNavItem } from './app-shell'
import { AppShell } from './app-shell'

const defaultNavItems: AppShellNavItem[] = [
  { label: 'Home', to: '/', isActive: true },
  { label: 'About', to: '/about', isActive: false },
]

const aboutNavItems: AppShellNavItem[] = [
  { label: 'Home', to: '/', isActive: false },
  { label: 'About', to: '/about', isActive: true },
]

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    navItems: defaultNavItems,
    userName: 'Ben Nogueira',
    userEmail: 'ben@example.com',
    onSignOut: fn(),
    children: (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Home</p>
          <h1 className="text-3xl font-semibold text-slate-900">Hello Ben</h1>
        </div>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Starter Status</CardTitle>
            <CardDescription>Quick snapshot of the app shell.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            The sidebar keeps navigation and account actions within easy reach.
          </CardContent>
        </Card>
      </div>
    ),
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AboutActive: Story = {
  args: {
    navItems: aboutNavItems,
  },
}

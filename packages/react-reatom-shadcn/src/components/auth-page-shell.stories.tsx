import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AuthPageShell } from './auth-page-shell'

const meta = {
  title: 'Components/AuthPageShell',
  component: AuthPageShell,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: (
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent>Shared authentication page layout.</CardContent>
      </Card>
    ),
  },
} satisfies Meta<typeof AuthPageShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

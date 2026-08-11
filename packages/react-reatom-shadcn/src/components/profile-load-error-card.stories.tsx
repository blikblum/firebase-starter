import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ProfileLoadErrorCard } from './profile-load-error-card'

const meta = {
  title: 'Components/ProfileLoadErrorCard',
  component: ProfileLoadErrorCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    error: 'Unable to reach Firestore.',
    onRetry: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof ProfileLoadErrorCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

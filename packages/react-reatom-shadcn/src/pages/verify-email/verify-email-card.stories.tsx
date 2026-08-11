import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { VerifyEmailCard } from './verify-email-card'

const meta = {
  title: 'Components/VerifyEmailCard',
  component: VerifyEmailCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    email: 'person@example.com',
    onCheck: fn(),
    onResend: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof VerifyEmailCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checking: Story = {
  args: {
    checking: true,
  },
}

export const Sending: Story = {
  args: {
    sending: true,
  },
}

export const Sent: Story = {
  args: {
    message: 'Verification email sent to person@example.com.',
  },
}

export const NotVerifiedYet: Story = {
  args: {
    message: 'Email is not verified yet. Open the link, then check again.',
  },
}

export const ErrorState: Story = {
  args: {
    error: 'Too many attempts. Wait a moment and try again.',
  },
}

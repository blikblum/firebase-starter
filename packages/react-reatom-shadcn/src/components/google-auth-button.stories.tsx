import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { GoogleAuthButton } from './google-auth-button'

const meta = {
  title: 'Components/GoogleAuthButton',
  component: GoogleAuthButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof GoogleAuthButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Redirecting: Story = {
  args: {
    busy: true,
  },
}

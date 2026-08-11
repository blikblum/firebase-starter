import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { LoginForm } from './login-form'

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onGoogleSignIn: fn(),
    onSubmit: fn(),
    showDevUser: false,
  },
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DevMode: Story = {
  args: {
    showDevUser: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Use dev user/ }))
    await expect(canvas.getByLabelText('Email')).toHaveValue('ben@example.com')
    await expect(canvas.getByLabelText('Password')).toHaveValue('password123')
  },
}

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Email'), 'not-an-email')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(canvas.getByText('Password is required.')).toBeVisible()
  },
}

export const SigningIn: Story = {
  args: {
    busy: true,
  },
}

export const ErrorState: Story = {
  args: {
    error: 'Invalid email or password.',
  },
}

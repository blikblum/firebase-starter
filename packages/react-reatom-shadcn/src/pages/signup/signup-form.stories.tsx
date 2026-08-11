import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { SignUpForm } from './signup-form'

const meta = {
  title: 'Components/SignUpForm',
  component: SignUpForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onGoogleSignIn: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SignUpForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Email'), 'not-an-email')
    await userEvent.type(canvas.getByLabelText('Password'), 'short')
    await userEvent.type(canvas.getByLabelText('Confirm password'), 'different')
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))

    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(canvas.getByText('Password must be at least 8 characters.')).toBeVisible()
    await expect(canvas.getByText('Passwords do not match.')).toBeVisible()
  },
}

export const NormalizedSubmission: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Email'), '  person@example.com  ')
    await userEvent.type(canvas.getByLabelText('Password'), ' password123 ')
    await userEvent.type(canvas.getByLabelText('Confirm password'), ' password123 ')
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))

    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'person@example.com',
      password: ' password123 ',
    })
  },
}

export const RedirectingToGoogle: Story = {
  args: {
    busy: true,
  },
}

export const ErrorState: Story = {
  args: {
    error: 'An account already exists with this email address.',
  },
}

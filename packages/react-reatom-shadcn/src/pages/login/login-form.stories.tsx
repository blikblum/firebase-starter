import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, userEvent, within } from 'storybook/test'

import type { AppSession } from '@/api/appSession'
import { appSessionAtom } from '@/stores/appSession'

import { LoginForm } from './login-form'

const defaultSession: AppSession = {
  isSigned: false,
  isSigning: false,
  error: undefined,
  user: undefined,
}

const errorSession: AppSession = {
  ...defaultSession,
  error: 'Invalid email or password.',
}

function LoginFormStoryWrapper({ session }: { session: AppSession }): React.JSX.Element {
  React.useEffect(() => {
    appSessionAtom.set(session)
  }, [session])

  return <LoginForm />
}

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <LoginFormStoryWrapper session={defaultSession} />,
}

export const DevMode: Story = {
  render: () => <LoginFormStoryWrapper session={defaultSession} />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the dev-only autofill button when `import.meta.env.DEV` is true.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Use dev user/ }))
    await expect(canvas.getByLabelText('Email')).toHaveValue('ben@example.com')
    await expect(canvas.getByLabelText('Password')).toHaveValue('password123')
  },
}

export const ValidationErrors: Story = {
  render: () => <LoginFormStoryWrapper session={defaultSession} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Email'), 'not-an-email')
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))

    await expect(canvas.getByText('Enter a valid email address.')).toBeVisible()
    await expect(canvas.getByText('Password is required.')).toBeVisible()
  },
}

export const SigningIn: Story = {
  render: () => (
    <LoginFormStoryWrapper
      session={{
        ...defaultSession,
        isSigning: true,
      }}
    />
  ),
}

export const ErrorState: Story = {
  render: () => <LoginFormStoryWrapper session={errorSession} />,
}

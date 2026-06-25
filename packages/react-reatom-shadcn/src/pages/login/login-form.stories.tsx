import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'

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
}

export const ErrorState: Story = {
  render: () => <LoginFormStoryWrapper session={errorSession} />,
}

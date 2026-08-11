import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { OnboardingForm } from './onboarding-form'

const meta = {
  title: 'Components/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultName: 'Ada Lovelace',
    onSubmit: fn(),
  },
} satisfies Meta<typeof OnboardingForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GoogleNamePrefill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('Name')).toHaveValue('Ada Lovelace')
    await expect(canvas.queryByLabelText('Email')).not.toBeInTheDocument()
  },
}

export const ValidationError: Story = {
  args: {
    defaultName: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Finish setup' }))
    await expect(canvas.getByText('Name is required.')).toBeVisible()
  },
}

export const NormalizedSubmission: Story = {
  args: {
    defaultName: '',
    onSubmit: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), '  Grace Hopper  ')
    await userEvent.click(canvas.getByRole('button', { name: 'Finish setup' }))
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: 'Grace Hopper' })
  },
}

export const Saving: Story = {
  args: {
    busy: true,
  },
}

export const ErrorState: Story = {
  args: {
    error: 'Unable to create your profile.',
  },
}

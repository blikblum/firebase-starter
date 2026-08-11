import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { expect, userEvent, within } from 'storybook/test'

import { FormCheckbox } from './form-checkbox'

interface CheckboxStoryValues {
  watched: boolean
}

function FormCheckboxStory({ invalid = false }: { invalid?: boolean }): React.JSX.Element {
  const form = useForm<CheckboxStoryValues>({
    defaultValues: { watched: false },
  })

  React.useEffect(() => {
    if (invalid) {
      form.setError('watched', { message: 'Choose whether the movie was watched.' })
    } else {
      form.clearErrors('watched')
    }
  }, [form, invalid])

  return (
    <FormProvider {...form}>
      <form className="w-80">
        <FormCheckbox<CheckboxStoryValues>
          name="watched"
          label="Watched"
          description="Mark this movie as watched."
          variant="card"
        />
      </form>
    </FormProvider>
  )
}

const meta = {
  title: 'Components/Form/FormCheckbox',
  component: FormCheckboxStory,
  args: {
    invalid: false,
  },
} satisfies Meta<typeof FormCheckboxStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Watched' })

    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}

export const ErrorState: Story = {
  args: {
    invalid: true,
  },
}

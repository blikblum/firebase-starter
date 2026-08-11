import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'

import { FormInput } from './form-input'

interface InputStoryValues {
  email: string
}

function FormInputStory({ invalid = false }: { invalid?: boolean }): React.JSX.Element {
  const form = useForm<InputStoryValues>({
    defaultValues: { email: '' },
  })

  React.useEffect(() => {
    if (invalid) {
      form.setError('email', { message: 'Enter a valid email address.' })
    } else {
      form.clearErrors('email')
    }
  }, [form, invalid])

  return (
    <FormProvider {...form}>
      <form className="w-80 space-y-4">
        <FormInput<InputStoryValues>
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          description="We will use this address to contact you."
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}

const meta = {
  title: 'Components/Form/FormInput',
  component: FormInputStory,
  args: {
    invalid: false,
  },
} satisfies Meta<typeof FormInputStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ErrorState: Story = {
  args: {
    invalid: true,
  },
}

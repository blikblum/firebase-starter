import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'

import { FormTextarea } from './form-textarea'

interface TextareaStoryValues {
  notes: string
}

function FormTextareaStory({ invalid = false }: { invalid?: boolean }): React.JSX.Element {
  const form = useForm<TextareaStoryValues>({
    defaultValues: { notes: '' },
  })

  React.useEffect(() => {
    if (invalid) {
      form.setError('notes', { message: 'Notes must be shorter than 500 characters.' })
    } else {
      form.clearErrors('notes')
    }
  }, [form, invalid])

  return (
    <FormProvider {...form}>
      <form className="w-80 space-y-4">
        <FormTextarea<TextareaStoryValues>
          name="notes"
          label="Notes"
          placeholder="Add a note"
          description="Optional details for your collection."
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}

const meta = {
  title: 'Components/Form/FormTextarea',
  component: FormTextareaStory,
  args: {
    invalid: false,
  },
} satisfies Meta<typeof FormTextareaStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ErrorState: Story = {
  args: {
    invalid: true,
  },
}

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { userProfileInputSchema, type UserProfileInput } from 'base/user-profile'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldError, FieldGroup } from '@/components/ui/field'

const onboardingSchema = userProfileInputSchema.pick({ name: true })
type OnboardingValues = z.output<typeof onboardingSchema>

export interface OnboardingFormProps {
  busy?: boolean
  defaultName?: string
  error?: string
  onSubmit: (input: Pick<UserProfileInput, 'name'>) => void | Promise<unknown>
}

export function OnboardingForm({
  busy = false,
  defaultName = '',
  error,
  onSubmit,
}: OnboardingFormProps): React.JSX.Element {
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: defaultName,
    },
  })

  React.useEffect(() => {
    form.reset({ name: defaultName })
  }, [defaultName, form])

  const isBusy = busy || form.formState.isSubmitting
  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Card className="w-full border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Finish setting up your account</CardTitle>
        <CardDescription>
          Confirm how your name should appear before entering the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <FormInput<OnboardingValues>
                name="name"
                label="Name"
                id="onboarding-name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
              />
              <FieldError>{error ?? null}</FieldError>
            </FieldGroup>
            <Button className="w-full" type="submit" disabled={isBusy}>
              {isBusy ? 'Finishing setup...' : 'Finish setup'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'
import { signIn } from '@/stores/appSession.service'

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  password: z.string().trim().min(1, 'Password is required.'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm(): React.JSX.Element {
  const session = useStore(appSessionAtom)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const isDevMode = import.meta.env.DEV
  const isBusy = session.isSigning || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    await signIn(values)
  })

  const handlePopulateDevUser = (): void => {
    form.reset({
      email: 'ben@example.com',
      password: 'password123',
    })
  }

  return (
    <Card className="w-full max-w-md border-white/70 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter email and password</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <FormInput<LoginValues>
                name="email"
                label="Email"
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
              <FormInput<LoginValues>
                name="password"
                label="Password"
                id="login-password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
              />
              <FieldError>{session.error ?? null}</FieldError>
            </FieldGroup>
            <div className="space-y-3">
              <Button className="w-full" type="submit" disabled={isBusy}>
                {isBusy ? 'Signing in...' : 'Sign in'}
              </Button>
              {isDevMode ? (
                <Button
                  className="w-full"
                  type="button"
                  variant="outline"
                  onClick={handlePopulateDevUser}
                >
                  Use dev user (ben@example.com)
                </Button>
              ) : null}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

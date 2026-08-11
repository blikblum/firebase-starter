import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { SignUpInput } from '@/api/auth'
import { signUpInputSchema } from '@/api/auth'
import {
  defaultRenderAuthLink,
  type AuthLinkRenderer,
} from '@/components/auth-page-shell'
import { FormInput } from '@/components/form/form-input'
import { GoogleAuthButton } from '@/components/google-auth-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldError, FieldGroup, FieldSeparator } from '@/components/ui/field'

const signUpFormSchema = signUpInputSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.output<typeof signUpFormSchema>

export interface SignUpFormProps {
  busy?: boolean
  error?: string
  onGoogleSignIn: () => void | Promise<void>
  onSubmit: (input: SignUpInput) => void | Promise<void>
  renderLink?: AuthLinkRenderer
}

export function SignUpForm({
  busy = false,
  error,
  onGoogleSignIn,
  onSubmit,
  renderLink = defaultRenderAuthLink,
}: SignUpFormProps): React.JSX.Element {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const isBusy = busy || form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    await onSubmit({ email, password })
  })

  return (
    <Card className="w-full border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Use Google or sign up with your email.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GoogleAuthButton
          busy={busy && !form.formState.isSubmitting}
          disabled={isBusy}
          onClick={onGoogleSignIn}
        />
        <FieldSeparator>Or continue with email</FieldSeparator>
        <FormProvider {...form}>
          <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <FormInput<SignUpFormValues>
                name="email"
                label="Email"
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
              <FormInput<SignUpFormValues>
                name="password"
                label="Password"
                description="Use at least 8 characters. Spaces are preserved."
                id="signup-password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <FormInput<SignUpFormValues>
                name="confirmPassword"
                label="Confirm password"
                id="signup-confirm-password"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              <FieldError>{error ?? null}</FieldError>
            </FieldGroup>
            <Button className="w-full" type="submit" disabled={isBusy}>
              {isBusy ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </FormProvider>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          {renderLink({
            to: '/login',
            className: 'font-medium text-primary underline-offset-4 hover:underline',
            children: 'Sign in',
          })}
        </p>
      </CardContent>
    </Card>
  )
}

import * as React from 'react'

import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'
import { signIn } from '@/stores/appSession.service'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm(): React.JSX.Element {
  const session = useStore(appSessionAtom)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const isDevMode = import.meta.env.DEV

  const isBusy = session.isSigning
  const isFormReady = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!isFormReady || isBusy) {
      return
    }

    await signIn({
      email: email.trim(),
      password: password.trim(),
    })
  }

  const handlePopulateDevUser = (): void => {
    setEmail('ben@example.com')
    setPassword('password123')
  }

  return (
    <Card className="w-full max-w-md border-white/70 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter email and password</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                id="login-password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            <FieldError>{session.error ?? null}</FieldError>
          </FieldGroup>
          <div className="space-y-3">
            <Button className="w-full" type="submit" disabled={!isFormReady || isBusy}>
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
      </CardContent>
    </Card>
  )
}

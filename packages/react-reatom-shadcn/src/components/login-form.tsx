import * as React from 'react'

import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'
import { mockLogin } from '@/stores/appSession.service'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const session = useStore(appSessionAtom)
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')

  const isBusy = session.isSigning
  const isFormReady = email.trim().length > 0 && name.trim().length > 0

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!isFormReady || isBusy) {
      return
    }

    await mockLogin({
      email: email.trim(),
      name: name.trim(),
    })
  }

  return (
    <Card className="w-full max-w-md border-white/70 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use any email and name to start the mock session.</CardDescription>
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
              <FieldLabel htmlFor="login-name">Name</FieldLabel>
              <Input
                id="login-name"
                type="text"
                placeholder="Taylor Morgan"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>
            <FieldError>{session.error ?? null}</FieldError>
          </FieldGroup>
          <Button className="w-full" type="submit" disabled={!isFormReady || isBusy}>
            {isBusy ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground text-xs">
        Mock sign-in takes a moment to finish.
      </CardFooter>
    </Card>
  )
}

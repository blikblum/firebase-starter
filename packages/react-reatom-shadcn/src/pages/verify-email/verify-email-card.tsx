import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldError } from '@/components/ui/field'

export interface VerifyEmailCardProps {
  checking?: boolean
  email: string
  error?: string
  message?: string
  sending?: boolean
  onCheck: () => void | Promise<unknown>
  onResend: () => void | Promise<void>
  onSignOut: () => void | Promise<void>
}

export function VerifyEmailCard({
  checking = false,
  email,
  error,
  message,
  sending = false,
  onCheck,
  onResend,
  onSignOut,
}: VerifyEmailCardProps): React.JSX.Element {
  const busy = checking || sending

  return (
    <Card className="w-full border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We sent a verification link to <span className="font-medium text-foreground">{email}</span>.
          Open it, then return here to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message ? (
          <p className="text-sm text-muted-foreground" role="status">
            {message}
          </p>
        ) : null}
        <FieldError>{error ?? null}</FieldError>
        <Button className="w-full" type="button" disabled={busy} onClick={() => void onCheck()}>
          {checking ? 'Checking...' : 'I’ve verified my email'}
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => void onResend()}
        >
          {sending ? 'Sending...' : 'Resend verification email'}
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => void onSignOut()}
        >
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}

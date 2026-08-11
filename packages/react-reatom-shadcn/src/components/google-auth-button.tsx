import { Button } from '@/components/ui/button'

export interface GoogleAuthButtonProps {
  busy?: boolean
  disabled?: boolean
  onClick: () => void | Promise<void>
}

export function GoogleAuthButton({
  busy = false,
  disabled = false,
  onClick,
}: GoogleAuthButtonProps): React.JSX.Element {
  return (
    <Button
      className="w-full"
      type="button"
      variant="outline"
      disabled={busy || disabled}
      onClick={() => void onClick()}
    >
      {busy ? 'Redirecting to Google...' : 'Continue with Google'}
    </Button>
  )
}

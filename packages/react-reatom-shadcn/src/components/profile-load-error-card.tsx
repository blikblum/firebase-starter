import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface ProfileLoadErrorCardProps {
  error: string
  onRetry: () => void
  onSignOut: () => void | Promise<void>
}

export function ProfileLoadErrorCard({
  error,
  onRetry,
  onSignOut,
}: ProfileLoadErrorCardProps): React.JSX.Element {
  return (
    <Card className="w-full border-border/70 bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle>Unable to load your profile</CardTitle>
        <CardDescription>{error}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={onRetry}>
          Try again
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => void onSignOut()}>
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}

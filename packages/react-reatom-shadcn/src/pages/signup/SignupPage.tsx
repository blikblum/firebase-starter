import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

import { AuthPageShell, type AuthLinkProps } from '@/components/auth-page-shell'
import { ProfileLoadErrorCard } from '@/components/profile-load-error-card'
import { useStore } from '@/helpers/reatom'
import { SignUpForm } from '@/pages/signup/signup-form'
import { appSessionAtom } from '@/stores/appSession'
import { signInWithGoogle, signOut, signUp } from '@/stores/appSession.service'
import { userProfileAtom } from '@/stores/userProfile'
import { listenToCurrentUserProfile } from '@/stores/userProfile.service'

const RouterLink = (props: AuthLinkProps): React.ReactElement => <Link {...props} />

export function SignupPage(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)
  const profile = useStore(userProfileAtom)
  const navigate = useNavigate({ from: '/signup' })

  React.useEffect(() => {
    if (!session.isAuthReady || !session.isSigned) {
      return
    }

    if (!session.user?.emailVerified) {
      void navigate({ to: '/verify-email' })
    } else if (profile.data) {
      void navigate({ to: '/' })
    } else if (profile.missing) {
      void navigate({ to: '/onboarding' })
    }
  }, [navigate, profile.data, profile.missing, session])

  if (!session.isAuthReady || session.isSigned) {
    if (session.isSigned && profile.error) {
      return (
        <AuthPageShell>
          <ProfileLoadErrorCard
            error={profile.error}
            onRetry={() => void listenToCurrentUserProfile()}
            onSignOut={signOut}
          />
        </AuthPageShell>
      )
    }

    return null
  }

  return (
    <AuthPageShell>
      <SignUpForm
        busy={session.isSigning}
        error={session.error}
        onGoogleSignIn={signInWithGoogle}
        onSubmit={signUp}
        renderLink={RouterLink}
      />
    </AuthPageShell>
  )
}

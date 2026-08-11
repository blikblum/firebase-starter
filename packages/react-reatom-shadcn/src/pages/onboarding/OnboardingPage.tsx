import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'

import { AuthPageShell } from '@/components/auth-page-shell'
import { ProfileLoadErrorCard } from '@/components/profile-load-error-card'
import { useStore } from '@/helpers/reatom'
import { OnboardingForm } from '@/pages/onboarding/onboarding-form'
import { appSessionAtom } from '@/stores/appSession'
import { signOut } from '@/stores/appSession.service'
import { userProfileAtom } from '@/stores/userProfile'
import {
  completeOnboarding,
  listenToCurrentUserProfile,
} from '@/stores/userProfile.service'

export function OnboardingPage(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)
  const user = session.user
  const profile = useStore(userProfileAtom)
  const navigate = useNavigate({ from: '/onboarding' })

  React.useEffect(() => {
    if (!session.isAuthReady) {
      return
    }

    if (!session.isSigned) {
      void navigate({ to: '/login' })
    } else if (!session.user?.emailVerified) {
      void navigate({ to: '/verify-email' })
    } else if (profile.data) {
      void navigate({ to: '/' })
    }
  }, [navigate, profile.data, session])

  if (
    !session.isAuthReady ||
    !session.isSigned ||
    !user?.emailVerified ||
    profile.data ||
    (profile.loading && !profile.missing)
  ) {
    return null
  }

  if (profile.error && !profile.missing) {
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

  return (
    <AuthPageShell>
      <OnboardingForm
        busy={profile.loading}
        defaultName={user.name}
        error={profile.error}
        onSubmit={(input) =>
          completeOnboarding({
            ...input,
            email: user.email,
          })
        }
      />
    </AuthPageShell>
  )
}

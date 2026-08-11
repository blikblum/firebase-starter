import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'

import { AuthPageShell } from '@/components/auth-page-shell'
import { ProfileLoadErrorCard } from '@/components/profile-load-error-card'
import { useStore } from '@/helpers/reatom'
import { VerifyEmailCard } from '@/pages/verify-email/verify-email-card'
import { appSessionAtom, emailVerificationStateAtom } from '@/stores/appSession'
import {
  refreshEmailVerification,
  resendVerificationEmail,
  signOut,
} from '@/stores/appSession.service'
import { userProfileAtom } from '@/stores/userProfile'
import { listenToCurrentUserProfile } from '@/stores/userProfile.service'

export function VerifyEmailPage(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)
  const verification = useStore(emailVerificationStateAtom)
  const profile = useStore(userProfileAtom)
  const navigate = useNavigate({ from: '/verify-email' })

  React.useEffect(() => {
    if (!session.isAuthReady) {
      return
    }

    if (!session.isSigned) {
      void navigate({ to: '/login' })
    } else if (session.user?.emailVerified) {
      if (profile.data) {
        void navigate({ to: '/' })
      } else if (profile.missing) {
        void navigate({ to: '/onboarding' })
      }
    }
  }, [navigate, profile.data, profile.missing, session])

  if (!session.isAuthReady || !session.isSigned) {
    return null
  }

  if (session.user?.emailVerified) {
    if (profile.error) {
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
      <VerifyEmailCard
        checking={verification.isChecking}
        email={session.user?.email ?? ''}
        error={verification.error}
        message={verification.message}
        sending={verification.isSending}
        onCheck={refreshEmailVerification}
        onResend={resendVerificationEmail}
        onSignOut={signOut}
      />
    </AuthPageShell>
  )
}

import { createFileRoute } from '@tanstack/react-router'

import { VerifyEmailPage } from '../pages/verify-email/VerifyEmailPage'

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
})

import { useEffect, JSX } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { LoginForm } from '@/components/login-form'
import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute(): JSX.Element | null {
  const session = useStore(appSessionAtom)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    if (session.isSigned) {
      void navigate({ to: '/' })
    }
  }, [navigate, session.isSigned])

  if (session.isSigned) {
    return null
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 right-6 h-64 w-64 rounded-full bg-sky-200/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 rounded-full bg-amber-100/80 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

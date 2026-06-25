import * as React from 'react'

import { useStore } from '@/helpers/reatom'
import { appSessionAtom } from '@/stores/appSession'

export function HomePage(): React.JSX.Element | null {
  const session = useStore(appSessionAtom)

  if (!session.isSigned) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-500">Home</p>
      <h1 className="text-3xl font-semibold text-slate-900">Hello {session.user?.name ?? ''}</h1>
      <p className="text-base text-slate-600">
        You&apos;re signed in and ready to explore the starter.
      </p>
    </div>
  )
}

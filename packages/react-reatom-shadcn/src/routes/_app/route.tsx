import * as React from 'react'
import { createFileRoute, useRouterState } from '@tanstack/react-router'

import { AppLayoutPage } from '../../pages/app-layout/AppLayoutPage'

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
})

function AppLayoutRoute(): React.JSX.Element | null {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return <AppLayoutPage pathname={pathname} />
}

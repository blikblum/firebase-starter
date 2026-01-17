import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_app/about')({
  component: AboutRoute,
})

function AboutRoute(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500">About</p>
        <h1 className="text-3xl font-semibold text-slate-900">About the app</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Firebase Starter</CardTitle>
          <CardDescription>Build on top of a fast, typed baseline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            This starter connects Firebase Auth with a lightweight Reatom store and
            Shadcn UI building blocks.
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>File-based routing with TanStack Router.</li>
            <li>Composable UI from Shadcn.</li>
            <li>Typed state management powered by Reatom.</li>
            <li>Firebase Auth emulator-friendly sign-in.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

import * as React from 'react'

export interface AuthLinkProps {
  to: string
  className?: string
  children?: React.ReactNode
}

export type AuthLinkRenderer = (props: AuthLinkProps) => React.ReactElement

export const defaultRenderAuthLink: AuthLinkRenderer = ({ to, ...props }) => {
  return <a href={to} {...props} />
}

export function AuthPageShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 right-6 size-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-72 -translate-x-1/3 rounded-full bg-secondary blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}

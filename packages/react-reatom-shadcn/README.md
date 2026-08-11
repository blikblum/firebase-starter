# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Authentication setup

Enable Email/Password and Google providers in Firebase Authentication. For deployed environments,
also add the app's domain to Firebase Authentication's authorized domains so Google redirect sign-in
can return to the app.

New users verify their email when required, complete `/onboarding`, and then receive a
`/users/{uid}` profile whose `createdAt` and `updatedAt` values are server timestamps. The profile
creation timestamp is the lifecycle anchor for future trial logic. Migrate existing production users
explicitly before treating this timestamp as an entitlement or trial boundary.

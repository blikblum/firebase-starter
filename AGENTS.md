# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm workspace for a Firebase/TypeScript starter. Root Firebase files include `firebase.json`, `.firebaserc`, `firestore.rules`, and `firestore.indexes.json`.

It contains shared code in `packages/base/` and `packages/tools/`, and applications such as `react-reatom-shadcn/`.

Each app has its own architectural patterns and stack and can run independently while consuming shared domain contracts from `base`.

- `packages/base/`: shared configuration and the authoritative domain layer.
- `packages/tools/`: development and data scripts, such as `src/populateData.ts`.
- `packages/react-reatom-shadcn/`: React app using Vite, TanStack Router, Reatom, Tailwind CSS, and shadcn-style UI.

## Shared Domain Architecture

- Organize each shared domain in a focused module under `packages/base/` and expose it through an explicit `package.json` subpath export such as `base/movies`.
- Define runtime domain contracts with Zod. Infer their TypeScript input and output types with `z.input` and `z.output` instead of maintaining duplicate interfaces by hand.
- Keep reusable normalization, structured validation, and pure domain/document factory functions beside the schemas that define their invariants.
- Keep `base` independent of React, Reatom, and application-specific state. Applications and tools may orchestrate domain functions but must not duplicate domain rules locally.
- Treat form submissions, route input, service arguments, Firebase documents, API responses, environment values, and file or CLI data as untrusted. Parse them with the owning domain's Zod schema before treating them as domain values.
- Do not use type assertions such as `as Movie` to bypass runtime validation. If a boundary has no suitable schema, add one to its domain module in `base` and export the inferred type.

## Build, Test, and Development Commands

Run commands from the repository root unless noted.

- `pnpm install`: install workspace dependencies.
- `pnpm start-emulators`: start Firebase auth, Firestore, and functions emulators.
- `pnpm --filter tools populate:data`: run the Firebase data population script.
- `pnpm --filter base exec tsc --noEmit`: type-check the shared domain package.

> Each app package has its own scripts

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Replace yarn by pnpm` and `Improve route layout`. Keep commits focused.

Pull requests should include a summary, testing performed, linked issues when applicable, and screenshots or Storybook links for UI changes. Call out Firebase rule, emulator, or data-script changes so reviewers can verify local setup impact.

## Agent-Specific Instructions

Prefer existing package patterns and workspace commands. Avoid committing local emulator state, build output, or `node_modules`.

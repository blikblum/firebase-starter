# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm workspace for a Firebase/TypeScript starter. Root Firebase files include `firebase.json`, `.firebaserc`, `firestore.rules`, and `firestore.indexes.json`.

It contains common code in `packages/base/` and `packages/tools/`, and different applications like `react-reatom-shadcn/`. 

Each app has its own architectural patterns / stack and are self contained, running independently of each other.

- `packages/base/`: shared configuration and code, currently including `firebase.config.ts`.
- `packages/tools/`: development and data scripts, such as `src/populateData.ts`.
- `packages/react-reatom-shadcn/`: React app using Vite, TanStack Router, Reatom, Tailwind CSS, and shadcn-style UI.

## Build, Test, and Development Commands

Run commands from the repository root unless noted.

- `pnpm install`: install workspace dependencies.
- `pnpm start-emulators`: start Firebase auth, Firestore, and functions emulators.
- `pnpm --filter tools populate:data`: run the Firebase data population script.

> Each app package has its own scripts

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Replace yarn by pnpm` and `Improve route layout`. Keep commits focused.

Pull requests should include a summary, testing performed, linked issues when applicable, and screenshots or Storybook links for UI changes. Call out Firebase rule, emulator, or data-script changes so reviewers can verify local setup impact.

## Agent-Specific Instructions

Prefer existing package patterns and workspace commands. Avoid committing local emulator state, build output, or `node_modules`.

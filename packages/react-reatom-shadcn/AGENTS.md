# react-reatom-shadcn

This is a starter template for building React applications using Reatom for state management and Shadcn UI components.

## Architecture Overview

- **UI Components**: Built using Shadcn, a collection of UI components for React.
- **Domain Layer**: Shared domain schemas, inferred types, normalization, validation, and pure factories live in `packages/base` and are imported through `base/*` exports.
- **State Management**: Application state is managed using Reatom.
- **Routing**: Managed with TanStack Router with file-based routing. Configured to SPA mode.
- **Build Tool**: Vite is used for development and production builds.

## File Organization

- `src/components`: app components, stories, and reusable UI primitives under `components/ui/`.
- `src/helpers`: utility functions.
- `src/api`: React-app-specific contracts such as session and authentication types; do not place shared domain models or rules here.
- `src/stores`: Reatom UI/application state and services that orchestrate Firebase and validated `base/*` domain values.
- `src/pages`: page components for each route.
- `src/routes`: application routes.
- `public/` and `src/assets/`: static assets.

## Domain and Validation Boundaries

- Import shared schemas, types, validators, normalization, and document factories from the owning `base/*` module. Do not recreate them in components, routes, `src/api`, or stores.
- Validate every untrusted value with Zod before passing it into application state or domain logic. This includes form submissions, route params/search, public service arguments, and Firebase reads.
- Do not cast Firebase or other external data to a domain type. Add an appropriate schema to `packages/base` when one is missing, parse the external value, and surface validation failures through the service's normal error state.
- Keep form-only representation schemas next to the form when displayed values differ from domain values. Transform those values and pipe them into the exported base schema; submit only the parsed domain output.
- Keep local loading, saving, selection, and error-state interfaces with their Reatom stores. Shared business entities and input contracts belong in `base`.

## Build & Development

Run the following commands from the package folder:

- `pnpm dev`: run the React app locally with Vite.
- `pnpm build`: type-check and build the React app.
- `pnpm check:types`: run TypeScript project checks without building assets.
- `pnpm lint`: run ESLint on the React package.
- `pnpm storybook`: start Storybook on port 6006.

## Testing

- Vitest is used for unit testing, and Storybook is used for component development and testing.
- Component tests should be done using Storybook stories. `<component>.stories.tsx` should be created alongside each component.

## General Guidelines

- Keep types strict and explicit. Prefer typed params and explicit return types for functions, and avoid unused locals/params.
- After updating TypeScript code, check for type errors before finishing by running `pnpm --filter react-reatom-shadcn check:types`.
- When a shared schema or inferred domain type changes, also run `pnpm --filter base exec tsc --noEmit` and type-check every affected consumer.
- Do not edit generated files such as `src/routeTree.gen.ts` by hand.

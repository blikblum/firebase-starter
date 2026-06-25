# react-reatom-shadcn

This is a starter template for building React applications using Reatom for state management and Shadcn UI components.

## Architecture Overview

- **UI Components**: Built using Shadcn, a collection of UI components for React.
- **State Management**: Application state is managed using Reatom
- **Routing**: Managed with TanStack Router with file-based routing. Configured to SPA mode.
- **Build Tool**: Vite is used for development and production builds.

## File Organization

- `src/components`: app components, stories, and reusable UI primitives under `components/ui/`.
- `src/helpers`: Utility functions
- `src/api`: Business logic types and functions.
- `src/stores`: Reatom atoms and related services
- `src/pages`: Page components for each route
- `src/routes`: Application routes
- `public/` and `src/assets/`: static assets.

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
- Do not edit generated files such as `src/routeTree.gen.ts` by hand.

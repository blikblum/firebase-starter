---
name: manage-routes
description: Create or edit TanStack Router file-based routes in this repo. Use when adding/removing route files under src/routes, changing route paths, adding layout or pathless layout routes, wiring Outlet usage, or adjusting navigation/redirect logic tied to routes.
---

# Manage Routes

## Overview

Create and refactor TanStack Router routes using the file-based routing conventions in this repo. Keep route registration in `src/routes`, page UI in `src/pages/<page-name>/PageNamePage.tsx`, and use layout/pathless layout patterns with `Outlet` when needed.

## Workflow

### 1) Choose the route type and file name

- Prefer flat route files under `src/routes/*.tsx` for normal pages.
- Use a layout route when multiple pages share UI or auth logic.
- Use a pathless layout for shared UI without adding a path segment (prefix with `_`).
- Use directory route structure only when a layout or route grouping is clearer with `route.tsx` and child files.
- Create the matching page component in `src/pages/<page-name>/PageNamePage.tsx`.
- Keep page-specific components, stories, and helpers in the same page folder instead of a shared folder.

Examples:

- `/login` route (flat): `src/routes/login.tsx` with `createFileRoute('/login')`.
- Use a layout folder only when needed, for example `src/routes/_app/route.tsx` with child pages such as `src/routes/_app/index.tsx` or `src/routes/_app/about.tsx`.
- About page UI: `src/pages/about/AboutPage.tsx`.
- Page-local components: `src/pages/login/login-form.tsx`, `src/pages/login/login-form.stories.tsx`.

### 2) Implement the route component

- Use explicit return types: `React.JSX.Element` or `React.JSX.Element | null`.
- Use `<Outlet />` in layout routes to render child content.
- Prefer `Link`, `useNavigate`, `useRouterState`, and `Route.useParams()` from `@tanstack/react-router` instead of manual URL handling.
- If auth gating is required, read the session atom via `useStore` and redirect to `/login` when signed out.
- Keep page components presentation-focused. If a page needs route-owned state such as params, search, loader data, or route-scoped navigation, create a wrapper `*Route` component in the route file, read the route state there, and pass plain props into `PageNamePage`.

Example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { ProductPage } from '../pages/product/ProductPage'

export const Route = createFileRoute('/products/$productId')({
	component: ProductRoute,
})

function ProductRoute(): React.JSX.Element {
	const { productId } = Route.useParams()

	return <ProductPage productId={productId} />
}
```

### 3) Keep file-based routing in sync

- Do not edit `src/routeTree.gen.ts` directly; it is generated.
- After adding/moving routes, ensure `createFileRoute()` paths reflect the file path (the plugin will update them on build/dev).

### 4) Verify types

- Run `pnpm --filter react-reatom-shadcn check:types` after changes.

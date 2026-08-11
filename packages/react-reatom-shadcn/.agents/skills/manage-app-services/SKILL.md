---
name: manage-app-services
description: Create or update Firebase-backed service functions in this repo while validating service inputs and external data with schemas from packages/base. Use when adding services, realtime listeners, query params, persistence mapping, or DOM task wiring under src/stores.
---

# Manage App Services

Keep Firebase and other side effects in `src/stores/<name>.service.ts`. Use services to validate boundary data, call pure domain functions from `base/*`, and update Reatom application state.

## 1) Inspect the domain boundary

- Find the owning module in `packages/base` and its exported input, persisted-document, and entity schemas.
- Import domain schemas, inferred types, validators, normalization, and document factories through the package subpath, such as `base/movies`.
- If a required runtime schema is missing, add it to the base domain module and export it. Do not recreate a domain schema under `src/api`, `src/stores`, or a component.
- Keep Firebase SDK objects, Reatom atoms, loading/error state, and subscription lifecycle in the React package. Keep `base` independent of Firebase, React, and Reatom.

## 2) Validate every service boundary

Treat public service arguments, Firebase snapshots, pipeline results, API responses, local storage, and DOM payloads as untrusted even when TypeScript gives them a static type.

- Parse service input with the exported base input schema, or call the base validator when it provides the required structured result.
- Parse complete Firebase document data with an exported document/entity schema before writing it to an atom or returning it.
- Combine Firestore's document ID with snapshot data before parsing when the entity schema includes the ID.
- Use `safeParse()` when invalid data should become normal store error state. Use `parse()` only when the surrounding `try`/`catch` deliberately maps the thrown validation error.
- Never use `as Movie`, `as MovieDocument`, or another domain assertion to bypass validation.
- Do not preserve partially parsed collections. If a document is invalid, fail the request or listener update and surface a useful service error.

A snapshot mapper should follow this shape, using the actual schema exported by the domain module:

```ts
import { movieSchema, type Movie } from 'base/movies'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

function toMovie(snapshot: QueryDocumentSnapshot<DocumentData>): Movie {
  const result = movieSchema.safeParse({
    ...snapshot.data(),
    id: snapshot.id,
  })

  if (!result.success) {
    throw new Error(`Movie ${snapshot.id} contains invalid data.`, {
      cause: result.error,
    })
  }

  return result.data
}
```

If `movieSchema` does not exist, add the corresponding persisted/entity schema to `packages/base/movies.ts` before using this pattern.

## 3) Update atoms consistently

- Set loading or saving state before starting asynchronous work.
- On success, store only parsed domain output and clear stale errors.
- On validation, authentication, Firebase, or network failure, preserve the store's established data policy and set a user-facing error.
- Keep reusable mapping and error conversion helpers small and local unless they express domain behavior that belongs in `base`.

For realtime data, treat `onSnapshot` as the producer: parse every snapshot in `next`, update the atom only after the whole payload succeeds, map validation failures to error state, and return the Firebase unsubscribe function.

## 4) Use params atoms for live queries

When a query depends on changing UI parameters, define a focused params atom next to the store or in `src/stores/<name>QueryParams.ts`.

- Validate route/search input before assigning it to the params atom.
- Read the atom while building the query so the current state drives the request.
- Rebuild subscriptions with Reatom v1000 `effect` or `withChangeHook`; do not use older `Ctx`, `ctx.get`, or `.onChange` examples.
- Use `withConnectHook` and return the Firebase unsubscribe when the listener should exist only while the store has subscribers.

```ts
import { effect } from '@reatom/core'

import { listenToMovies } from './movies.service'
import { moviesQueryParamsAtom } from './moviesQueryParams'

effect(() => {
  moviesQueryParamsAtom()
  listenToMovies()
}, 'listenToMoviesOnParamsChange')
```

## 5) Update usages and verify

- Search for every caller, mapper, and related atom before changing a service signature.
- Update form, route, tool, and listener call sites to pass the expected input and handle failure consistently.
- When a shared schema or type changes, check every package that imports its `base/*` export.

Run from the repository root:

- `pnpm --filter react-reatom-shadcn check:types`
- `pnpm --filter base exec tsc --noEmit` when a shared domain module changes

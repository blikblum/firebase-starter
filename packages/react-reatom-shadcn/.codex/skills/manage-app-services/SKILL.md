---
name: manage-app-services
description: Create or update service functions in this repo, especially store-related services in `src/stores/*.service.ts`. Use when adding new service functions, changing service behavior or params, or wiring services to DOM tasks.
---

# Manage App Services

Follow these steps to add or update service functions and their wiring.

## 1) Create or update the service file

Place service functions in `src/stores/<name>.service.ts` and keep them focused on side effects or store updates.

Usually the service will update one or more atoms defined in `src/stores/<name>.ts`. Eventually the service may return data to the caller.

If requested, call the service when the atom is connected extending the atom with `withConnectHook`

Example:

```ts
import { moviesAtom } from './movies'
import { withConnectHook } from '@reatom/core'

export async function loadMovies(): Promise<void> {
  const response = await fetch('/api/movies')
  const movies = (await response.json()) as Movie[]
  moviesAtom.set(movies)
}

// optionally extend the atom to load movies on connect
moviesAtom.extend(withConnectHook(loadMovies))
```

## 2) Update call sites

Search for all usages and update parameters or return handling to match the service signature.

Use:

- `rg -n "\\.service\\.ts|loadMovies|deleteMovie" src`

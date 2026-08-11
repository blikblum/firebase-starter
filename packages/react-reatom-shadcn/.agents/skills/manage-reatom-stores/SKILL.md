---
name: manage-reatom-stores
description: Create or update Reatom stores in this repo while preserving the shared base domain boundary. Use when adding a store under `src/stores`, changing store state shape, adding computed atoms, or coordinating related service updates.
---

# Manage Reatom Stores

Follow these steps to create or update stores using the existing appSession patterns.

## 1) Separate domain values from application state

Import shared entities and input contracts from their `base/*` domain module. Define local interfaces beside the store only for application state such as loading, saving, selection, pagination, and errors. Keep React-app-specific session contracts in `src/api`; do not place shared domain types or rules there.

Example:

```ts
import type { Movie } from 'base/movies'

export interface MoviesListState {
  data: Movie[]
  loading: boolean
  error?: string
}
```

## 2) Create or update the store atom

Add a new file in `src/stores/*` or update the existing atom.

Example:

```ts
import { atom, computed } from '@reatom/core'
import type { Movie } from 'base/movies'

export const moviesListAtom = atom<MoviesListState>(
  {
    data: [],
    loading: false,
    error: undefined,
  },
  'moviesList',
)

export const movieCountAtom = computed(
  () => moviesListAtom().data.length,
  'movieCount',
)
```

Keep initial state explicit, and prefer small, focused atoms.

Add name strings as the second parameter to `atom` and `computed` for easier debugging.

## 3) Add or update service functions (if needed)

If store updates involve side effects or async logic, place functions in `src/stores/*.service.ts` and mutate state via `*.set`. Follow the `manage-app-services` skill for Firebase mapping, input parsing, subscription lifecycle, and error handling.

Validate service arguments and external data before placing domain values in an atom. Firebase snapshots, API responses, route input, and other untrusted values must be parsed with a schema exported by `base`; do not cast them to a domain type. Keep parsing and error handling in the service rather than the atom or consuming component.

## 4) Update usages

Search for all usages and update them to match the new store shape.

Use:

- `rg -n "moviesListAtom|movieCountAtom|fetchMovies" src`

After updating TypeScript store code, run:

- `pnpm --filter react-reatom-shadcn check:types`
- `pnpm --filter base exec tsc --noEmit` when a shared schema or type changes

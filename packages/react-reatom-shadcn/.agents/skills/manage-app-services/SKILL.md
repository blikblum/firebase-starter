---
name: manage-app-services
description: Create or update service functions in this repo, especially Firebase-backed store services in `src/stores/*.service.ts`. Use when adding service functions, realtime listeners, query params, or DOM task wiring.
---

# Manage App Services

Follow these steps to add or update service functions and their wiring.

## 1) Create or update the service file

Place service functions in `src/stores/<name>.service.ts` and keep them focused on side effects or store updates.

Usually the service will update one or more atoms defined in `src/stores/<name>.ts`. Eventually the service may return data to the caller.

Use the Firebase modular SDK for backend data. Prefer Firestore realtime listeners for data that should stay current in the UI.

Treat `onSnapshot` as the observable producer: create the subscription, push `next` and `error` states into Reatom atoms, and return the Firebase unsubscribe function.

Example:

```ts
import { collection, getFirestore, onSnapshot, orderBy, query, type Unsubscribe } from 'firebase/firestore'
import { moviesAtom } from './movies'
import { Movie } from '../api/movie'

let unsubscribeMovies: Unsubscribe | undefined

export function listenToMovies(): Unsubscribe {
  const db = getFirestore()
  const moviesQuery = query(collection(db, 'movies'), orderBy('title', 'asc'))

  unsubscribeMovies?.()

  moviesAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  unsubscribeMovies = onSnapshot(moviesQuery, {
    next(snapshot) {
      const data: Movie[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Movie[]

      moviesAtom.set({ loading: false, data, error: undefined })
    },
    error(error) {
      moviesAtom.set({ loading: false, data: undefined, error })
    },
  })

  return unsubscribeMovies
}
```

## 2) Use params atoms for parameterized queries

If a Firestore query depends on params, define those params in a separate atom, usually in `src/stores/<name>QueryParams.ts` or next to the main store atom.

Do not pass changing query params only through service function arguments when the UI needs live updates. Read the params atom inside the service and listen to the params atom to rebuild the subscription or refetch data.

Example:

```ts
import { atom } from '@reatom/core'

export interface MoviesQueryParams {
  tag?: string
}

export const moviesQueryParamsAtom = atom<MoviesQueryParams>({}, 'moviesQueryParams')
```

Then build the query from that atom:

```ts
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  type Query,
  type Unsubscribe,
  where,
} from 'firebase/firestore'
import { moviesAtom } from './movies'
import { moviesQueryParamsAtom } from './moviesQueryParams'
import { Movie } from '../api/movie'

let unsubscribeMovies: Unsubscribe | undefined

function getMoviesQuery(): Query {
  const db = getFirestore()
  const params = moviesQueryParamsAtom()
  let moviesQuery: Query = collection(db, 'movies')

  if (params.tag) {
    moviesQuery = query(moviesQuery, where('tags', 'array-contains', params.tag))
  }

  return query(moviesQuery, orderBy('title', 'asc'))
}

export function listenToMovies(): Unsubscribe {
  unsubscribeMovies?.()

  moviesAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  unsubscribeMovies = onSnapshot(getMoviesQuery(), {
    next(snapshot) {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Movie[]

      moviesAtom.set({ loading: false, data, error: undefined })
    },
    error(error) {
      moviesAtom.set({ loading: false, data: undefined, error })
    },
  })

  return unsubscribeMovies
}

export async function fetchMovies(): Promise<void> {
  moviesAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  try {
    const snapshot = await getDocs(getMoviesQuery())
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Movie[]

    moviesAtom.set({ loading: false, data, error: undefined })
  } catch (error) {
    moviesAtom.set({ loading: false, data: undefined, error: error as Error })
  }
}
```

## 3) Wire realtime updates

For global listeners, use Reatom v1000 APIs. Do not copy older Reatom examples that use `Ctx`, `ctx.get`, or `.onChange`.

Prefer `effect` when a params atom should drive a live query and the query may depend on multiple atoms now or later:

```ts
import { effect } from '@reatom/core'
import { listenToMovies } from './movies.service'
import { moviesQueryParamsAtom } from './moviesQueryParams'

effect(() => {
  moviesQueryParamsAtom()
  listenToMovies()
}, 'listenToMoviesOnParamsChange')
```

Use `withChangeHook` when one specific params atom is the stable trigger, especially if the service needs the new and previous params:

```ts
import { withChangeHook } from '@reatom/core'
import { listenToMovies } from './movies.service'
import { moviesQueryParamsAtom } from './moviesQueryParams'

moviesQueryParamsAtom.extend(
  withChangeHook((params, prevParams) => {
    if (params.tag === prevParams?.tag) {
      return
    }

    listenToMovies()
  }),
)
```

If the listener should only exist while a store has subscribers, extend the store atom with `withConnectHook` and return the Firestore unsubscribe:

```ts
import { withConnectHook } from '@reatom/core'
import { moviesAtom } from './movies'
import { listenToMovies } from './movies.service'

moviesAtom.extend(withConnectHook(listenToMovies))
```

## 4) Update call sites

Search for all usages and update parameters or return handling to match the service signature.

Use:

- `rg -n "\\.service\\.ts|listenToMovies|fetchMovies|moviesQueryParamsAtom" src`

After updating TypeScript service code, run:

- `yarn check:types`

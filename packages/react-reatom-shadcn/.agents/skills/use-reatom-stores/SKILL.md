---
name: use-reatom-stores
description: Consume Reatom stores in React components while preserving validated shared domain values. Use when subscribing to atoms, rendering store state, or wiring component actions to store services.
---

Follow these steps to use stores in components.

## 1) Import the store atom

```ts
import { moviesListAtom } from '@/stores/movies'
```

Import domain types from `base/*` only when component props or helpers need them. Do not redeclare domain models in the component.

## 2) Use with `useStore` hook

Use the `useStore` hook from `@/helpers/reatom` to subscribe to the atom and get its current value.

Example:

```tsx
import { useStore } from '@/helpers/reatom'
import { moviesListAtom } from '@/stores/movies'

export function MovieList(): React.JSX.Element {
  const moviesState = useStore(moviesListAtom)

  return (
    <ul>
      {moviesState.data.map((movie) => (
        <li key={movie.id}>
          {movie.title} ({movie.releaseYear ?? 'Unknown year'})
        </li>
      ))}
    </ul>
  )
}
```

Treat domain values in stores as already validated by their service boundary. Do not parse, normalize, or cast them again in the view. If untrusted data can reach an atom, fix the producer service to validate it with the owning `base/*` schema and expose failures through store error state.

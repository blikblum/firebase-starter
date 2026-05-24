---
name: use-reatom-stores
description: Use reatom stores in React components.
---


Follow these steps to use stores in your components

## 1) Import the store (Atom)


```ts
import { moviesAtom } from '@/stores/movies'
```

## 2) Use with `useStore` hook

Use the `useStore` hook from `@/helpers/reatom` to subscribe to the atom and get its current value.

Example:

```tsx
import { useStore } from '@/helpers/reatom'
import { moviesAtom } from '@/stores/movies'
export function MovieList() {
  const movies = useStore(moviesAtom)

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          {movie.title} ({movie.year})
        </li>
      ))}
    </ul>
  )
}
```

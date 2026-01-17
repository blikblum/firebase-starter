import { Atom } from '@reatom/core'
import { useSyncExternalStore } from 'react'

export function useStore<T>(atom: Atom<T>): T {
  return useSyncExternalStore(atom.subscribe, atom)
}

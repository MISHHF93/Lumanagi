import { useSyncExternalStore } from 'react'

type PartialState<T> = Partial<T> | ((state: T) => Partial<T>)

type Listener = () => void

type SetState<T> = (partial: PartialState<T>, replace?: boolean) => void

type GetState<T> = () => T

type Subscribe<T> = (listener: Listener) => () => void

type Selector<T, U> = (state: T) => U

export type StateCreator<T> = (
  set: SetState<T>,
  get: GetState<T>
) => T

interface StoreApi<T> {
  getState: GetState<T>
  setState: SetState<T>
  subscribe: Subscribe<T>
}

export function create<T extends Record<string, any>>(
  creator: StateCreator<T>
) {
  let state: T
  const listeners = new Set<Listener>()

  const setState: SetState<T> = (partial, replace = false) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: T) => Partial<T>)(state)
        : partial

    const newState = replace ? (nextState as T) : { ...state, ...nextState }

    if (newState === state) return

    state = newState
    listeners.forEach((listener) => listener())
  }

  const getState: GetState<T> = () => state

  const subscribe: Subscribe<T> = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  state = creator(setState, getState)

  function useStore(): T
  function useStore<U>(selector: Selector<T, U>): U
  function useStore<U>(selector?: Selector<T, U>): T | U {
    const snapshot = useSyncExternalStore(
      (listener) => subscribe(listener),
      () => state,
      () => state
    )

    if (selector) {
      return selector(snapshot)
    }

    return snapshot as T
  }

  ;(useStore as unknown as StoreApi<T>).getState = getState
  ;(useStore as unknown as StoreApi<T>).setState = setState
  ;(useStore as unknown as StoreApi<T>).subscribe = subscribe

  return useStore as typeof useStore & StoreApi<T>
}

export type Store<T> = ReturnType<typeof create<T>>

import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client, storage } from '../lib'

type State = {
  loggedIn: boolean
  theme: 'dark' | 'light'
}

type StoreApi = StoreActionApi<State>

const initialState: State = {
  loggedIn: !!storage.get('@token'),
  theme:
    storage.get<State['theme']>('@theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
}

const actions = {
  login: (token: string) => ({ setState }: StoreApi) => {
    storage.put('@token', token)

    setState({
      loggedIn: true
    })
  },
  logout: () => async ({ setState }: StoreApi) => {
    await client.clearStore()

    storage.remove('@token')

    setState({
      loggedIn: false
    })
  },
  setTheme: (theme: 'dark' | 'light') => ({ setState }: StoreApi) => {
    storage.put('@theme', theme)

    setState({
      theme
    })
  }
}

type Actions = typeof actions

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'auth'
})

export const useAuth = createHook(Store)

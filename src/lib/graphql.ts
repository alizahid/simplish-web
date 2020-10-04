import {
  ApolloClient,
  createHttpLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { set } from 'lodash'

import { storage } from './storage'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: HttpLink.from([
    onError((error) => {
      const unauthenticated = error.graphQLErrors?.find(
        ({ extensions }) => extensions?.code === 'UNAUTHENTICATED'
      )

      if (unauthenticated) {
        storage.clear()
      }
    }),
    createHttpLink({
      fetch(uri: RequestInfo, options: RequestInit) {
        const token = storage.get('@token')

        if (token) {
          set(options, 'headers.authorization', `Bearer ${token}`)
        }

        return fetch(uri, options)
      },
      uri: `${process.env.REACT_APP_API_URI}/graphql`
    })
  ])
})

import {
  ApolloClient,
  createHttpLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { set } from 'lodash'

import { firebase } from './firebase'
import { storage } from './storage'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
  link: HttpLink.from([
    onError((error) => {
      const unauthenticated = error.graphQLErrors?.find(
        ({ extensions }) => extensions?.code === 'UNAUTHENTICATED'
      )

      if (unauthenticated) {
        client.clearStore()

        storage.clear()

        firebase.auth().signOut()
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

import { gql, useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { client, helpers } from '../lib'
import {
  Mutation,
  MutationReorderListsArgs,
  Query,
  QueryListArgs
} from '../types/graphql'
import { LISTS } from './lists'

const REORDER_LISTS = gql`
  mutation reorderLists($order: [Int!]!) {
    reorderLists(order: $order)
  }
`

type ReorderListsReturns = {
  loading: boolean

  reorderLists: (fromIndex: number, toIndex: number) => Promise<unknown>
}

export const useReorderLists = (): ReorderListsReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'reorderLists'>,
    MutationReorderListsArgs
  >(REORDER_LISTS, {
    optimisticResponse: {
      reorderLists: true
    }
  })

  const reorderLists = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const lists = client.readQuery<Pick<Query, 'lists'>, QueryListArgs>({
        query: LISTS
      })

      if (!lists?.lists) {
        return
      }

      const next = helpers.reorderLists(lists.lists, fromIndex, toIndex)

      const order = next.map(({ id }) => id)

      return mutate({
        update(proxy) {
          proxy.writeQuery({
            data: {
              lists: next
            },
            query: LISTS
          })
        },
        variables: {
          order
        }
      })
    },
    [mutate]
  )

  return {
    loading,
    reorderLists
  }
}

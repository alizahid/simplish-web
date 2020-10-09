import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { cloneDeep } from 'lodash'
import { useCallback } from 'react'

import { client, helpers } from '../lib'
import {
  List,
  Mutation,
  MutationCreateListArgs,
  MutationDeleteListArgs,
  MutationReorderListArgs,
  MutationUpdateListArgs,
  Query,
  QueryItemsArgs,
  QueryListsArgs
} from '../types/graphql'
import { ITEMS } from './items'

export const LISTS = gql`
  query lists($boardId: Int) {
    lists(boardId: $boardId) {
      id
      name
      createdAt
    }
  }
`

type ListsReturns = {
  lists: List[]
  loading: boolean

  refetch: () => void
}

export const useLists = (boardId?: number): ListsReturns => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'lists'>,
    QueryListsArgs
  >(LISTS, {
    variables: {
      boardId
    }
  })

  return {
    lists: data?.lists ?? [],
    loading,
    refetch
  }
}

const CREATE_LIST = gql`
  mutation createList($name: String!, $boardId: Int) {
    createList(name: $name, boardId: $boardId) {
      id
      name
      createdAt
    }
  }
`

type CreateListReturns = {
  loading: boolean

  createList: (name: string, boardId?: number) => Promise<unknown>
}

export const useCreateList = (): CreateListReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'createList'>,
    MutationCreateListArgs
  >(CREATE_LIST)

  const createList = useCallback(
    (name: string, boardId?: number) =>
      mutate({
        optimisticResponse: {
          createList: {
            createdAt: dayjs().toISOString(),
            id: 0,
            name
          }
        },
        update(proxy, response) {
          if (!response.data?.createList) {
            return
          }

          const options = {
            query: LISTS,
            variables: {
              boardId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'lists'>, QueryListsArgs>(
            options
          )

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              lists: {
                $push: [response.data.createList]
              }
            })
          })
        },
        variables: {
          boardId,
          name
        }
      }),
    [mutate]
  )

  return {
    createList,
    loading
  }
}

const UPDATE_LIST = gql`
  mutation updateList($listId: Int!, $name: String!) {
    updateList(listId: $listId, name: $name) {
      id
      name
      createdAt
    }
  }
`

type UpdateListReturns = {
  loading: boolean

  updateList: (list: List, name: string) => Promise<unknown>
}

export const useUpdateList = (): UpdateListReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'updateList'>,
    MutationUpdateListArgs
  >(UPDATE_LIST)

  const updateList = useCallback(
    (list: List, name: string) =>
      mutate({
        optimisticResponse: {
          updateList: {
            ...list,
            name
          }
        },
        variables: {
          listId: list.id,
          name
        }
      }),
    [mutate]
  )

  return {
    loading,
    updateList
  }
}

const DELETE_LIST = gql`
  mutation deleteList($listId: Int!) {
    deleteList(listId: $listId)
  }
`

type DeleteListReturns = {
  loading: boolean

  deleteList: (listId: number, boardId?: number) => Promise<unknown>
}

export const useDeleteList = (): DeleteListReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'deleteList'>,
    MutationDeleteListArgs
  >(DELETE_LIST, {
    optimisticResponse: {
      deleteList: true
    }
  })

  const deleteList = useCallback(
    async (listId: number, boardId?: number) => {
      const yes = window.confirm('Are you sure you want to delete this list?')

      if (!yes) {
        return
      }

      return mutate({
        update(proxy) {
          const options = {
            query: LISTS,
            variables: {
              boardId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'lists'>, QueryListsArgs>(
            options
          )

          if (!data) {
            return
          }

          const index = data.lists.findIndex(({ id }) => id === listId)

          proxy.writeQuery({
            ...options,
            data: update(data, {
              lists: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          listId
        }
      })
    },
    [mutate]
  )

  return {
    deleteList,
    loading
  }
}

const REORDER_LIST = gql`
  mutation reorderList($listId: Int!, $order: [Int!]!) {
    reorderList(listId: $listId, order: $order)
  }
`

type ReorderListReturns = {
  loading: boolean

  reorderList: (
    listId: number,
    fromIndex: number,
    toIndex: number
  ) => Promise<unknown>
}

export const useReorderList = (): ReorderListReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'reorderList'>,
    MutationReorderListArgs
  >(REORDER_LIST, {
    optimisticResponse: {
      reorderList: true
    }
  })

  const reorderList = useCallback(
    async (listId: number, fromIndex: number, toIndex: number) => {
      const options = {
        query: ITEMS,
        variables: {
          listId
        }
      }

      const items = client.readQuery<Pick<Query, 'items'>, QueryItemsArgs>(
        options
      )

      if (!items) {
        return
      }

      const item = cloneDeep(items.items[fromIndex])

      const next = helpers.addItem(
        helpers.removeItem(items.items, fromIndex),
        item,
        toIndex
      )

      const order = next.map(({ id }) => id)

      if (!order) {
        return
      }

      return mutate({
        update(proxy) {
          proxy.writeQuery<Pick<Query, 'items'>, QueryItemsArgs>({
            ...options,
            data: {
              items: next
            }
          })
        },
        variables: {
          listId,
          order
        }
      })
    },
    [mutate]
  )

  return {
    loading,
    reorderList
  }
}

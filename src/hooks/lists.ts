import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { useCallback } from 'react'

import {
  List,
  Mutation,
  MutationCreateListArgs,
  MutationDeleteListArgs,
  MutationUpdateListArgs,
  Query,
  QueryBoardArgs,
  QueryListArgs
} from '../types/graphql'
import { BOARD } from './boards'

const LISTS = gql`
  query lists {
    lists {
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

export const useLists = (): ListsReturns => {
  const { data, loading, refetch } = useQuery<Pick<Query, 'lists'>>(LISTS)

  return {
    lists: data?.lists ?? [],
    loading,
    refetch
  }
}

export const LIST = gql`
  query list($listId: Int!) {
    list(listId: $listId) {
      id
      name
      createdAt
      items {
        id
        body
        complete
        description
        reminder
        createdAt
      }
    }
  }
`

type ListReturns = {
  list?: List
  loading: boolean

  refetch: () => void
}

export const useList = (listId: number): ListReturns => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'list'>,
    QueryListArgs
  >(LIST, {
    variables: {
      listId
    }
  })

  return {
    list: data?.list,
    loading,
    refetch
  }
}

export const CREATE_LIST = gql`
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
            id: Math.round(Math.random() * 1000),
            name
          }
        },
        update(proxy, response) {
          if (!response.data?.createList) {
            return
          }

          if (boardId) {
            const options = {
              query: BOARD,
              variables: {
                boardId
              }
            }

            const data = proxy.readQuery<Pick<Query, 'board'>, QueryBoardArgs>(
              options
            )

            if (!data) {
              return
            }

            proxy.writeQuery({
              ...options,
              data: update(data, {
                board: {
                  lists: {
                    $push: [response.data.createList]
                  }
                }
              })
            })
            return
          }

          const options = {
            query: LISTS
          }

          const data = proxy.readQuery<Pick<Query, 'lists'>>(options)

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

export const UPDATE_LIST = gql`
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

export const DELETE_LIST = gql`
  mutation deleteList($listId: Int!) {
    deleteList(listId: $listId)
  }
`

type DeleteListReturns = {
  loading: boolean

  deleteList: (listId: number) => Promise<unknown>
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
    async (listId: number) => {
      const yes = window.confirm('Are you sure you want to delete this list?')

      if (!yes) {
        return
      }

      return mutate({
        update(proxy) {
          const options = {
            query: LISTS
          }

          const data = proxy.readQuery<Pick<Query, 'lists'>>(options)

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

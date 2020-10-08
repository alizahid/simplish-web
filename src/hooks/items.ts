import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { cloneDeep } from 'lodash'
import { useCallback } from 'react'

import { client, helpers } from '../lib'
import {
  Item,
  ItemInput,
  Mutation,
  MutationCreateItemArgs,
  MutationDeleteItemArgs,
  MutationMoveItemArgs,
  MutationToggleItemArgs,
  MutationUpdateItemArgs,
  Query,
  QueryItemsArgs
} from '../types/graphql'

export const ITEMS = gql`
  query items($listId: Int!) {
    items(listId: $listId) {
      id
      body
      complete
      description
      date
      createdAt
    }
  }
`

type ItemsReturns = {
  items: Item[]
  loading: boolean
}

export const useItems = (listId: number): ItemsReturns => {
  const { data, loading } = useQuery<Pick<Query, 'items'>, QueryItemsArgs>(
    ITEMS,
    {
      variables: {
        listId
      }
    }
  )

  return {
    items: data?.items ?? [],
    loading
  }
}

const CREATE_ITEM = gql`
  mutation createItem($listId: Int!, $data: ItemInput!) {
    createItem(listId: $listId, data: $data) {
      id
      body
      complete
      description
      date
      createdAt
    }
  }
`

type CreateItemReturns = {
  loading: boolean

  createItem: (listId: number, data: ItemInput) => Promise<unknown>
}

export const useCreateItem = (): CreateItemReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'createItem'>,
    MutationCreateItemArgs
  >(CREATE_ITEM)

  const createItem = useCallback(
    (listId: number, data: ItemInput) =>
      mutate({
        optimisticResponse: {
          createItem: {
            body: data.body,
            complete: false,
            createdAt: dayjs().toISOString(),
            date: data.date ?? null,
            description: data.description ?? null,
            id: 0,
            updatedAt: dayjs().toISOString()
          }
        },
        update(proxy, response) {
          if (!response.data?.createItem) {
            return
          }

          const options = {
            query: ITEMS,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'items'>, QueryItemsArgs>(
            options
          )

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              items: {
                $unshift: [response.data.createItem]
              }
            })
          })
        },
        variables: {
          data,
          listId
        }
      }),
    [mutate]
  )

  return {
    createItem,
    loading
  }
}

const UPDATE_ITEM = gql`
  mutation updateItem($itemId: Int!, $data: ItemInput!) {
    updateItem(itemId: $itemId, data: $data) {
      id
      body
      complete
      description
      date
      createdAt
    }
  }
`

type UpdateItemReturns = {
  loading: boolean

  updateItem: (item: Item, data: ItemInput) => Promise<unknown>
}

export const useUpdateItem = (): UpdateItemReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'updateItem'>,
    MutationUpdateItemArgs
  >(UPDATE_ITEM)

  const updateItem = useCallback(
    (item: Item, data: ItemInput) =>
      mutate({
        optimisticResponse: {
          updateItem: {
            ...item,
            ...data
          }
        },
        variables: {
          data,
          itemId: item.id
        }
      }),
    [mutate]
  )

  return {
    loading,
    updateItem
  }
}

const DELETE_ITEM = gql`
  mutation deleteItem($itemId: Int!) {
    deleteItem(itemId: $itemId)
  }
`

type DeleteItemReturns = {
  loading: boolean

  deleteItem: (listId: number, itemId: number) => Promise<unknown>
}

export const useDeleteItem = (): DeleteItemReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'deleteItem'>,
    MutationDeleteItemArgs
  >(DELETE_ITEM, {
    optimisticResponse: {
      deleteItem: true
    }
  })

  const deleteItem = useCallback(
    async (listId: number, itemId: number) => {
      const yes = window.confirm('Are you sure you want to delete this item?')

      if (!yes) {
        return
      }

      return mutate({
        update(proxy) {
          const options = {
            query: ITEMS,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'items'>, QueryItemsArgs>(
            options
          )

          if (!data) {
            return
          }

          const index = data.items.findIndex(({ id }) => id === itemId)

          if (index === undefined) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              items: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          itemId
        }
      })
    },
    [mutate]
  )

  return {
    deleteItem,
    loading
  }
}

const TOGGLE_ITEM = gql`
  mutation toggleItem($itemId: Int!, $complete: Boolean!) {
    toggleItem(itemId: $itemId, complete: $complete)
  }
`

type ToggleItemReturns = {
  loading: boolean

  toggleItem: (
    listId: number,
    itemId: number,
    complete: boolean
  ) => Promise<unknown>
}

export const useToggleItem = (): ToggleItemReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'toggleItem'>,
    MutationToggleItemArgs
  >(TOGGLE_ITEM, {
    optimisticResponse: {
      toggleItem: true
    }
  })

  const toggleItem = useCallback(
    (listId: number, itemId: number, complete: boolean) =>
      mutate({
        update(proxy) {
          const options = {
            query: ITEMS,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'items'>, QueryItemsArgs>(
            options
          )

          if (!data) {
            return
          }

          const index = data.items.findIndex(({ id }) => id === itemId)

          if (index === undefined) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              items: {
                [index]: {
                  complete: {
                    $set: complete
                  }
                }
              }
            })
          })
        },
        variables: {
          complete,
          itemId
        }
      }),
    [mutate]
  )

  return {
    loading,
    toggleItem
  }
}

const MOVE_ITEM = gql`
  mutation moveItem(
    $itemId: Int!
    $fromListId: Int!
    $toListId: Int!
    $fromOrder: [Int!]!
    $toOrder: [Int!]!
  ) {
    moveItem(
      itemId: $itemId
      fromListId: $fromListId
      toListId: $toListId
      fromOrder: $fromOrder
      toOrder: $toOrder
    )
  }
`

type MoveItemReturns = {
  loading: boolean

  moveItem: (
    itemId: number,
    fromListId: number,
    toListId: number,
    fromIndex: number,
    toIndex: number
  ) => Promise<unknown>
}

export const useMoveItem = (): MoveItemReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'moveItem'>,
    MutationMoveItemArgs
  >(MOVE_ITEM, {
    optimisticResponse: {
      moveItem: true
    }
  })

  const moveItem = useCallback(
    async (
      itemId: number,
      fromListId: number,
      toListId: number,
      fromIndex: number,
      toIndex: number
    ) => {
      const fromList = client.readQuery<Pick<Query, 'items'>, QueryItemsArgs>({
        query: ITEMS,
        variables: {
          listId: fromListId
        }
      })

      if (!fromList) {
        return
      }

      const toList = client.readQuery<Pick<Query, 'items'>, QueryItemsArgs>({
        query: ITEMS,
        variables: {
          listId: toListId
        }
      })

      if (!toList) {
        return
      }

      const item = cloneDeep(fromList.items[fromIndex])

      const nextFromList = helpers.removeItem(fromList.items, fromIndex)
      const nextToList = helpers.addItem(toList.items, item, toIndex)

      const fromOrder = nextFromList.map(({ id }) => id)
      const toOrder = nextToList.map(({ id }) => id)

      if (!fromOrder || !toOrder) {
        return
      }

      client.writeQuery<Pick<Query, 'items'>, QueryItemsArgs>({
        data: {
          items: nextFromList
        },
        query: ITEMS,
        variables: {
          listId: fromListId
        }
      })

      client.writeQuery<Pick<Query, 'items'>, QueryItemsArgs>({
        data: {
          items: nextToList
        },
        query: ITEMS,
        variables: {
          listId: toListId
        }
      })

      return mutate({
        variables: {
          fromListId,
          fromOrder,
          itemId,
          toListId,
          toOrder
        }
      })
    },
    [mutate]
  )

  return {
    loading,
    moveItem
  }
}

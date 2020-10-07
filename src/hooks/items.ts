import { gql, useMutation } from '@apollo/client'
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
  QueryListArgs
} from '../types/graphql'
import { LIST } from './lists'

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
            ...data,
            complete: false,
            createdAt: dayjs().toISOString(),
            id: Math.round(Math.random() * 1000),
            updatedAt: dayjs().toISOString()
          }
        },
        update(proxy, response) {
          if (!response.data?.createItem) {
            return
          }

          const options = {
            query: LIST,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'list'>, QueryListArgs>(
            options
          )

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              list: {
                items: {
                  $unshift: [response.data.createItem]
                }
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
            query: LIST,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'list'>, QueryListArgs>(
            options
          )

          if (!data) {
            return
          }

          const index = data.list.items?.findIndex(({ id }) => id === itemId)

          if (index === undefined) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              list: {
                items: {
                  $splice: [[index, 1]]
                }
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
            query: LIST,
            variables: {
              listId
            }
          }

          const data = proxy.readQuery<Pick<Query, 'list'>, QueryListArgs>(
            options
          )

          if (!data) {
            return
          }

          const index = data.list.items?.findIndex(({ id }) => id === itemId)

          if (index === undefined) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              list: {
                items: {
                  [index]: {
                    complete: {
                      $set: complete
                    }
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
      const fromList = client.readQuery<Pick<Query, 'list'>, QueryListArgs>({
        query: LIST,
        variables: {
          listId: fromListId
        }
      })

      if (!fromList?.list.items) {
        return
      }

      const toList = client.readQuery<Pick<Query, 'list'>, QueryListArgs>({
        query: LIST,
        variables: {
          listId: toListId
        }
      })

      if (!toList?.list.items) {
        return
      }

      const item = cloneDeep(fromList.list.items[fromIndex])

      const nextFromList = helpers.removeItemFromList(fromList.list, fromIndex)
      const nextToList = helpers.addItemToList(toList.list, item, toIndex)

      const fromOrder = nextFromList.items?.map(({ id }) => id)
      const toOrder = nextToList.items?.map(({ id }) => id)

      if (!fromOrder || !toOrder) {
        return
      }

      return mutate({
        update(proxy) {
          proxy.writeQuery({
            data: {
              list: nextFromList
            },
            query: LIST,
            variables: {
              listId: fromListId
            }
          })

          proxy.writeQuery({
            data: {
              list: nextToList
            },
            query: LIST,
            variables: {
              listId: toListId
            }
          })
        },
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

import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { cloneDeep } from 'lodash'
import { useCallback } from 'react'

import { client, helpers } from '../lib'
import {
  Board,
  Mutation,
  MutationCreateBoardArgs,
  MutationDeleteBoardArgs,
  MutationReorderBoardArgs,
  MutationUpdateBoardArgs,
  Query,
  QueryBoardArgs
} from '../types/graphql'

const BOARDS = gql`
  query boards {
    boards {
      id
      name
      createdAt
    }
  }
`

type BoardsReturns = {
  boards: Board[]
  loading: boolean

  refetch: () => void
}

export const useBoards = (): BoardsReturns => {
  const { data, loading, refetch } = useQuery<Pick<Query, 'boards'>>(BOARDS)

  return {
    boards: data?.boards ?? [],
    loading,
    refetch
  }
}

export const BOARD = gql`
  query board($boardId: Int!) {
    board(boardId: $boardId) {
      id
      name
      createdAt
      lists {
        id
        name
        createdAt
      }
    }
  }
`

type BoardReturns = {
  board?: Board
  loading: boolean

  refetch: () => void
}

export const useBoard = (boardId: number): BoardReturns => {
  const { data, loading, refetch } = useQuery<
    Pick<Query, 'board'>,
    QueryBoardArgs
  >(BOARD, {
    variables: {
      boardId
    }
  })

  return {
    board: data?.board,
    loading,
    refetch
  }
}

const CREATE_BOARD = gql`
  mutation createBoard($name: String!) {
    createBoard(name: $name) {
      id
      name
      createdAt
    }
  }
`

type CreateBoardReturns = {
  loading: boolean

  createBoard: (name: string) => Promise<unknown>
}

export const useCreateBoard = (): CreateBoardReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'createBoard'>,
    MutationCreateBoardArgs
  >(CREATE_BOARD)

  const createBoard = useCallback(
    (name: string) =>
      mutate({
        optimisticResponse: {
          createBoard: {
            createdAt: dayjs().toISOString(),
            id: 0,
            name
          }
        },
        update(proxy, response) {
          if (!response.data?.createBoard) {
            return
          }

          const options = {
            query: BOARDS
          }

          const data = proxy.readQuery<Pick<Query, 'boards'>>(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              boards: {
                $push: [response.data.createBoard]
              }
            })
          })
        },
        variables: {
          name
        }
      }),
    [mutate]
  )

  return {
    createBoard,
    loading
  }
}

const UPDATE_BOARD = gql`
  mutation updateBoard($boardId: Int!, $name: String!) {
    updateBoard(boardId: $boardId, name: $name) {
      id
      name
      createdAt
    }
  }
`

type UpdateBoardReturns = {
  loading: boolean

  updateBoard: (board: Board, name: string) => Promise<unknown>
}

export const useUpdateBoard = (): UpdateBoardReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'updateBoard'>,
    MutationUpdateBoardArgs
  >(UPDATE_BOARD)

  const updateBoard = useCallback(
    (board: Board, name: string) =>
      mutate({
        optimisticResponse: {
          updateBoard: {
            ...board,
            name
          }
        },
        variables: {
          boardId: board.id,
          name
        }
      }),
    [mutate]
  )

  return {
    loading,
    updateBoard
  }
}

const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: Int!) {
    deleteBoard(boardId: $boardId)
  }
`

type DeleteBoardReturns = {
  loading: boolean

  deleteBoard: (boardId: number) => Promise<unknown>
}

export const useDeleteBoard = (): DeleteBoardReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'deleteBoard'>,
    MutationDeleteBoardArgs
  >(DELETE_BOARD, {
    optimisticResponse: {
      deleteBoard: true
    }
  })

  const deleteBoard = useCallback(
    async (boardId: number) => {
      const yes = window.confirm('Are you sure you want to delete this board?')

      if (!yes) {
        return
      }

      return mutate({
        update(proxy) {
          const options = {
            query: BOARDS
          }

          const data = proxy.readQuery<Pick<Query, 'boards'>>(options)

          if (!data) {
            return
          }

          const index = data.boards.findIndex(({ id }) => id === boardId)

          proxy.writeQuery({
            ...options,
            data: update(data, {
              boards: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          boardId
        }
      })
    },
    [mutate]
  )

  return {
    deleteBoard,
    loading
  }
}

const REORDER_BOARD = gql`
  mutation reorderBoard($boardId: Int!, $order: [Int!]!) {
    reorderBoard(boardId: $boardId, order: $order)
  }
`

type ReorderBoardReturns = {
  loading: boolean

  reorderBoard: (
    boardId: number,
    fromIndex: number,
    toIndex: number
  ) => Promise<unknown>
}

export const useReorderBoard = (): ReorderBoardReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'reorderBoard'>,
    MutationReorderBoardArgs
  >(REORDER_BOARD, {
    optimisticResponse: {
      reorderBoard: true
    }
  })

  const reorderBoard = useCallback(
    async (boardId: number, fromIndex: number, toIndex: number) => {
      const board = client.readQuery<Pick<Query, 'board'>, QueryBoardArgs>({
        query: BOARD,
        variables: {
          boardId
        }
      })

      if (!board?.board.lists) {
        return
      }

      const list = cloneDeep(board.board.lists[fromIndex])

      const next = helpers.addListToBoard(
        helpers.removeListFromBoard(board.board, fromIndex),
        list,
        toIndex
      )

      const order = next.lists?.map(({ id }) => id)

      if (!order) {
        return
      }

      client.writeQuery<Pick<Query, 'board'>, QueryBoardArgs>({
        data: {
          board: next
        },
        query: BOARD,
        variables: {
          boardId
        }
      })

      return mutate({
        variables: {
          boardId,
          order
        }
      })
    },
    [mutate]
  )

  return {
    loading,
    reorderBoard
  }
}

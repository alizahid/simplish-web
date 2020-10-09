import { gql, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import update from 'immutability-helper'
import { useCallback } from 'react'

import {
  Mutation,
  MutationCreateSnippetArgs,
  MutationDeleteSnippetArgs,
  MutationUpdateSnippetArgs,
  Query,
  Snippet,
  SnippetInput
} from '../types/graphql'

export const SNIPPETS = gql`
  query snippets {
    snippets {
      id
      name
      language
      content
      tags
      createdAt
    }
  }
`

type SnippetsReturns = {
  loading: boolean
  snippets: Snippet[]
}

export const useSnippets = (): SnippetsReturns => {
  const { data, loading } = useQuery<Pick<Query, 'snippets'>>(SNIPPETS)

  return {
    loading,
    snippets: data?.snippets ?? []
  }
}

const CREATE_SNIPPET = gql`
  mutation createSnippet($data: SnippetInput!) {
    createSnippet(data: $data) {
      id
      name
      language
      content
      tags
      createdAt
    }
  }
`

type CreateSnippetReturns = {
  loading: boolean

  createSnippet: (data: SnippetInput) => Promise<number | undefined>
}

export const useCreateSnippet = (): CreateSnippetReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'createSnippet'>,
    MutationCreateSnippetArgs
  >(CREATE_SNIPPET)

  const createSnippet = useCallback(
    async (data: SnippetInput) => {
      const response = await mutate({
        optimisticResponse: {
          createSnippet: {
            ...data,
            createdAt: dayjs().toISOString(),
            id: 0
          }
        },
        update(proxy, response) {
          if (!response.data?.createSnippet) {
            return
          }

          const options = {
            query: SNIPPETS
          }

          const data = proxy.readQuery<Pick<Query, 'snippets'>>(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              snippets: {
                $unshift: [response.data.createSnippet]
              }
            })
          })
        },
        variables: {
          data
        }
      })

      return response.data?.createSnippet.id
    },
    [mutate]
  )

  return {
    createSnippet,
    loading
  }
}

const UPDATE_SNIPPET = gql`
  mutation updateSnippet($snippetId: Int!, $data: SnippetInput!) {
    updateSnippet(snippetId: $snippetId, data: $data) {
      id
      name
      language
      content
      tags
      createdAt
    }
  }
`

type UpdateSnippetReturns = {
  loading: boolean

  updateSnippet: (snippet: Snippet, data: SnippetInput) => Promise<unknown>
}

export const useUpdateSnippet = (): UpdateSnippetReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'updateSnippet'>,
    MutationUpdateSnippetArgs
  >(UPDATE_SNIPPET)

  const updateSnippet = useCallback(
    (snippet: Snippet, data: SnippetInput) =>
      mutate({
        optimisticResponse: {
          updateSnippet: {
            ...snippet,
            ...data
          }
        },
        variables: {
          data,
          snippetId: snippet.id
        }
      }),
    [mutate]
  )

  return {
    loading,
    updateSnippet
  }
}

const DELETE_SNIPPET = gql`
  mutation deleteSnippet($snippetId: Int!) {
    deleteSnippet(snippetId: $snippetId)
  }
`

type DeleteSnippetReturns = {
  loading: boolean

  deleteSnippet: (snippetId: number) => Promise<unknown>
}

export const useDeleteSnippet = (): DeleteSnippetReturns => {
  const [mutate, { loading }] = useMutation<
    Pick<Mutation, 'deleteSnippet'>,
    MutationDeleteSnippetArgs
  >(DELETE_SNIPPET, {
    optimisticResponse: {
      deleteSnippet: true
    }
  })

  const deleteSnippet = useCallback(
    async (snippetId: number) => {
      const yes = window.confirm(
        'Are you sure you want to delete this snippet?'
      )

      if (!yes) {
        return
      }

      return mutate({
        update(proxy) {
          const options = {
            query: SNIPPETS
          }

          const data = proxy.readQuery<Pick<Query, 'snippets'>>(options)

          if (!data) {
            return
          }

          const index = data.snippets.findIndex(({ id }) => id === snippetId)

          proxy.writeQuery({
            ...options,
            data: update(data, {
              snippets: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          snippetId
        }
      })
    },
    [mutate]
  )

  return {
    deleteSnippet,
    loading
  }
}

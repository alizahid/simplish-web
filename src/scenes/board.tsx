import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

import { Error, ItemBoard, Spinner } from '../components'
import { useBoard, useLists, usePageTitle } from '../hooks'

export const Board: FunctionComponent = () => {
  const { id } = useParams<{
    id: string
  }>()

  const boardId = Number(id)

  const { board, loading } = useBoard(boardId)

  const { lists, loading: fetching } = useLists(boardId)

  usePageTitle(`${board?.name ?? 'Loading'} / Boards / Simplish`)

  if (loading || fetching) {
    return <Spinner size="large" />
  }

  if (!board) {
    return <Error message="This board doesn't exist." title="Not found" />
  }

  return <ItemBoard boardId={board.id} lists={lists} />
}

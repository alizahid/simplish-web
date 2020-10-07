import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

import { Error, ItemBoard, Spinner } from '../components'
import { useBoard, usePageTitle } from '../hooks'

export const Board: FunctionComponent = () => {
  const { id } = useParams<{
    id: string
  }>()

  const { board, loading } = useBoard(Number(id))

  usePageTitle(`${board?.name ?? 'Loading'} / Boards / Simplish`)

  if (loading) {
    return <Spinner size="large" />
  }

  if (!board?.lists) {
    return <Error message="This board doesn't exist." title="Not found" />
  }

  return <ItemBoard boardId={board.id} lists={board.lists} />
}

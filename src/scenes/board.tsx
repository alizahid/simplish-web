import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { useParams } from 'react-router-dom'

import { Error, ItemBoard, Spinner } from '../components'
import { useBoard } from '../hooks'

export const Board: FunctionComponent = () => {
  const { id } = useParams<{
    id: string
  }>()

  const { board, loading } = useBoard(Number(id))

  if (loading) {
    return <Spinner size="large" />
  }

  if (!board?.lists) {
    return <Error message="This board doesn't exist." title="Not found" />
  }

  return (
    <DocumentTitle title={`${board.name} / Boards / Simplish`}>
      <ItemBoard boardId={board.id} lists={board.lists} />
    </DocumentTitle>
  )
}

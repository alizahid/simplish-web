import React, { FunctionComponent, useState } from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'

import { Form, Icon, Spinner } from '../components'
import {
  useBoards,
  useCreateBoard,
  useDeleteBoard,
  useUpdateBoard
} from '../hooks'
import { styled } from '../stitches.config'

const Item = styled('div', {
  ':hover div': {
    opacity: 1
  },

  alignItems: 'center',
  display: 'flex',
  lineHeight: '$regular',
  marginBottom: '$margin',
  width: '$list'
})

const Actions = styled('div', {
  alignItems: 'center',
  display: 'flex',
  marginLeft: 'auto',
  opacity: 0,
  transition: '$smooth'
})

export const Boards: FunctionComponent = () => {
  const { boards, loading } = useBoards()

  const { createBoard } = useCreateBoard()
  const { updateBoard } = useUpdateBoard()
  const { deleteBoard } = useDeleteBoard()

  const [editing, setEditing] = useState(new Map())

  if (loading) {
    return <Spinner size="large" />
  }

  const toggleEditing = (id: number) => {
    const next = new Map(editing)

    if (next.get(id)) {
      next.delete(id)
    } else {
      next.set(id, true)
    }

    setEditing(next)
  }

  return (
    <>
      <DocumentTitle title="Boards / Simplish" />

      {boards.map((board) => (
        <Item key={board.id}>
          {editing.get(board.id) ? (
            <Form
              autoFocus
              board={board}
              css={{
                lineHeight: '$regular',
                width: '$list'
              }}
              onBoard={(name) => {
                updateBoard(board, name)

                toggleEditing(board.id)
              }}
              onCancel={() => toggleEditing(board.id)}
              placeholder="Name"
              type="board"
            />
          ) : (
            <Link to={`/boards/${board.id}`}>{board.name}</Link>
          )}
          <Actions>
            <Icon
              css={{
                cursor: 'pointer',
                marginLeft: '$padding'
              }}
              icon="edit"
              onClick={() => toggleEditing(board.id)}
            />
            <Icon
              css={{
                cursor: 'pointer',
                marginLeft: '$padding'
              }}
              icon="remove"
              onClick={() => deleteBoard(board.id)}
            />
          </Actions>
        </Item>
      ))}

      <Form
        css={{
          width: '$list'
        }}
        onBoard={(name) => createBoard(name)}
        placeholder="New board"
        type="board"
      />
    </>
  )
}

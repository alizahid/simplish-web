import React, { FunctionComponent, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import {
  useCreateItem,
  useCreateList,
  useDeleteList,
  useMoveItem,
  useReorderBoard,
  useReorderList,
  useReorderLists,
  useUpdateList
} from '../hooks'
import { helpers } from '../lib'
import { styled } from '../stitches.config'
import { List } from '../types/graphql'
import { Form } from './form'
import { Icon } from './icon'
import { ItemList } from './list'

const Main = styled('div', {
  overflowX: 'auto'
})

const Content = styled('div', {
  display: 'flex',
  marginLeft: '-$margin',
  marginRight: '-$margin'
})

const Column = styled('div', {
  ':hover .list-actions': {
    opacity: 1
  },

  marginLeft: '$margin',
  marginRight: '$margin',
  width: '$list'
})

const Header = styled('div', {
  alignItems: 'center',
  color: '$foreground',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '$margin'
})

const Title = styled('h2', {
  fontSize: '$subtitle',
  fontWeight: '$medium',
  lineHeight: '$subtitle'
})

const Actions = styled('div', {
  alignItems: 'center',
  display: 'flex',
  opacity: 0,
  transition: '$smooth'
})

interface Props {
  boardId?: number
  lists: List[]
}

export const ItemBoard: FunctionComponent<Props> = ({ boardId, lists }) => {
  const { createList } = useCreateList()
  const { updateList } = useUpdateList()
  const { deleteList } = useDeleteList()

  const { createItem } = useCreateItem()
  const { moveItem } = useMoveItem()

  const { reorderBoard } = useReorderBoard()
  const { reorderList } = useReorderList()
  const { reorderLists } = useReorderLists()

  const [adding, setAdding] = useState(new Map())
  const [editing, setEditing] = useState(new Map())

  const toggleAdding = (id: number) => {
    const next = new Map(adding)

    if (next.get(id)) {
      next.delete(id)
    } else {
      next.set(id, true)
    }

    setAdding(next)
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
    <Main>
      <DragDropContext
        onDragEnd={({ destination, draggableId, source, type }) => {
          if (!destination) {
            return
          }

          if (
            source.index === destination.index &&
            source.droppableId === destination.droppableId
          ) {
            return
          }

          if (type === 'item') {
            const fromListId = helpers.getListId(source.droppableId)
            const toListId = helpers.getListId(destination.droppableId)

            const fromIndex = source.index
            const toIndex = destination.index

            if (fromListId === toListId) {
              reorderList(fromListId, fromIndex, toIndex)
            } else {
              const itemId = helpers.getItemId(draggableId)

              moveItem(itemId, fromListId, toListId, fromIndex, toIndex)
            }
          }

          if (type === 'list') {
            const boardId = helpers.getBoardId(destination.droppableId)

            const fromIndex = source.index
            const toIndex = destination.index

            if (boardId === 0) {
              reorderLists(fromIndex, toIndex)
            } else {
              reorderBoard(boardId, fromIndex, toIndex)
            }
          }
        }}>
        <Droppable
          direction="horizontal"
          droppableId={['board', boardId].filter(Boolean).join('-')}
          type="list">
          {({ droppableProps, innerRef, placeholder }) => (
            <Content
              ref={innerRef}
              {...droppableProps}
              css={{
                width: `calc(var(--sizes-list) * ${
                  lists.length + 1
                } + var(--space-space) * ${lists.length + 1})`
              }}>
              {lists.map((list, index) => (
                <Draggable
                  draggableId={`list-${list.id}`}
                  index={index}
                  key={list.id}>
                  {({ dragHandleProps, draggableProps, innerRef }) => (
                    <Column ref={innerRef} {...draggableProps}>
                      <Header {...dragHandleProps}>
                        {editing.get(list.id) ? (
                          <Form
                            autoFocus
                            css={{
                              input: {
                                fontSize: '$subtitle',
                                fontWeight: '$medium',
                                lineHeight: '$subtitle'
                              }
                            }}
                            list={list}
                            onCancel={() => toggleEditing(list.id)}
                            onList={(name) => {
                              updateList(list, name)

                              toggleEditing(list.id)
                            }}
                            placeholder="Name"
                            type="list"
                          />
                        ) : (
                          <Title onClick={() => toggleEditing(list.id)}>
                            {list.name}
                          </Title>
                        )}
                        <Actions className="list-actions">
                          <Icon
                            css={{
                              cursor: 'pointer'
                            }}
                            icon={adding.get(list.id) ? 'cross' : 'add'}
                            onClick={() => toggleAdding(list.id)}
                          />
                          <Icon
                            css={{
                              cursor: 'pointer',
                              marginLeft: '$padding'
                            }}
                            icon="remove"
                            onClick={() => deleteList(list.id)}
                          />
                        </Actions>
                      </Header>
                      <ItemList id={list.id}>
                        {adding.get(list.id) && (
                          <Form
                            autoFocus
                            css={{
                              marginBottom: '$margin',
                              width: '$list'
                            }}
                            onCancel={() => toggleAdding(list.id)}
                            onItem={(body, date) => {
                              createItem(list.id, {
                                body,
                                date
                              })

                              toggleAdding(list.id)
                            }}
                            placeholder="New item"
                            type="item"
                          />
                        )}
                      </ItemList>
                    </Column>
                  )}
                </Draggable>
              ))}
              {placeholder}
              <Form
                css={{
                  alignSelf: 'flex-start',
                  marginLeft: '$margin',
                  marginRight: '$margin',
                  width: '$list'
                }}
                onList={(name) => createList(name, boardId)}
                placeholder="New list"
                type="list"
              />
            </Content>
          )}
        </Droppable>
      </DragDropContext>
    </Main>
  )
}

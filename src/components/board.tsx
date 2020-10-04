import React, { FunctionComponent, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { useCreateItem, useCreateList, useDeleteList } from '../hooks'
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
  fontWeight: '$medium'
})

const Actions = styled('div', {
  alignItems: 'center',
  display: 'flex'
})

interface Props {
  id?: number
  lists: List[]
}

export const ItemBoard: FunctionComponent<Props> = ({ id, lists }) => {
  const { create } = useCreateList()
  const { remove } = useDeleteList()

  const { createItem } = useCreateItem()

  const [adding, setAdding] = useState(new Map())

  const toggle = (id: number) => {
    const next = new Map(adding)

    if (next.get(id)) {
      next.delete(id)
    } else {
      next.set(id, true)
    }

    setAdding(next)
  }

  return (
    <Main>
      <DragDropContext
        onDragEnd={(drop) => {
          console.log('drop', drop)
        }}>
        <Droppable
          direction="horizontal"
          droppableId={['board', id].filter(Boolean).join('-')}
          isCombineEnabled={false}
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
                        <Title>{list.name}</Title>
                        <Actions>
                          <Icon
                            css={{
                              cursor: 'pointer'
                            }}
                            icon={adding.get(list.id) ? 'cross' : 'add'}
                            onClick={() => toggle(list.id)}
                          />
                          <Icon
                            css={{
                              cursor: 'pointer',
                              marginLeft: '$padding'
                            }}
                            icon="remove"
                            onClick={() => remove(list.id)}
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
                            onCancel={() => toggle(list.id)}
                            onItem={(body, reminder) => {
                              createItem(list.id, {
                                body,
                                reminder
                              })

                              toggle(list.id)
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
                onList={(name) => create(name, id)}
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

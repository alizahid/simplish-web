import dayjs from 'dayjs'
import React, { FunctionComponent, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { useDeleteItem, useToggleItem, useUpdateItem } from '../hooks'
import { styled } from '../stitches.config'
import { Item } from '../types/graphql'
import { Form } from './form'
import { Icon } from './icon'

const Main = styled('div', {
  ':hover .item-actions': {
    opacity: 1
  },

  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '$margin',
  position: 'relative'
})

const Todo = styled('div', {
  color: '$foreground',
  flex: 1,

  variants: {
    complete: {
      true: {
        color: '$foregroundLight',
        textDecoration: 'line-through'
      }
    }
  }
})

const Body = styled('div', {
  lineHeight: '$regular'
})

const Date = styled('div', {
  color: '$foregroundLight',
  fontSize: '$small',
  lineHeight: '$small',
  marginTop: '$half'
})

const Actions = styled('div', {
  alignItems: 'center',
  borderRadius: '$small',
  display: 'flex',
  opacity: 0,
  position: 'absolute',
  right: 0,
  transition: '$smooth'
})

interface Props {
  index: number
  item: Item
  listId: number
}

export const ItemCard: FunctionComponent<Props> = ({ index, item, listId }) => {
  const { deleteItem } = useDeleteItem()
  const { toggleItem } = useToggleItem()
  const { updateItem } = useUpdateItem()

  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <Form
        autoFocus
        css={{
          marginBottom: '$margin'
        }}
        item={item}
        onCancel={() => setEditing(false)}
        onItem={(body, date) => {
          updateItem(item, {
            body,
            date
          })

          setEditing(false)
        }}
        type="item"
      />
    )
  }

  return (
    <Draggable draggableId={`item-${item.id}`} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <Main ref={innerRef} {...draggableProps} {...dragHandleProps}>
          <Todo complete={item.complete} onClick={() => setEditing(true)}>
            <Body>{item.body}</Body>
            {item.date && <Date>{dayjs(item.date).format('lll')}</Date>}
          </Todo>
          <Actions className="item-actions">
            <Icon
              css={{
                cursor: 'pointer'
              }}
              icon={item.complete ? 'cross' : 'check'}
              onClick={() => toggleItem(listId, item.id, !item.complete)}
            />
            <Icon
              css={{
                cursor: 'pointer',
                marginLeft: '$half'
              }}
              icon="remove"
              onClick={() => deleteItem(listId, item.id)}
            />
          </Actions>
        </Main>
      )}
    </Draggable>
  )
}

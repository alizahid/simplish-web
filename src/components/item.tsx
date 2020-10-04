import dayjs from 'dayjs'
import React, { FunctionComponent, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { useDeleteItem, useToggleItem, useUpdateItem } from '../hooks'
import { styled } from '../stitches.config'
import { Item, List } from '../types/graphql'
import { Form } from './form'
import { Icon } from './icon'

const Main = styled('div', {
  ':hover .actions': {
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

const Reminder = styled('div', {
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
  list: List
}

export const ItemCard: FunctionComponent<Props> = ({ index, item, list }) => {
  const { remove } = useDeleteItem()
  const { toggle } = useToggleItem()
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
        onItem={(body, reminder) => {
          console.log('foo')

          updateItem(item, {
            body,
            reminder
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
            {item.reminder && (
              <Reminder>{dayjs(item.reminder).format('lll')}</Reminder>
            )}
          </Todo>
          <Actions className="actions">
            <Icon
              css={{
                cursor: 'pointer'
              }}
              icon={item.complete ? 'cross' : 'check'}
              onClick={() => toggle(list.id, item.id, !item.complete)}
            />
            <Icon
              css={{
                cursor: 'pointer',
                marginLeft: '$half'
              }}
              icon="remove"
              onClick={() => remove(list.id, item.id)}
            />
          </Actions>
        </Main>
      )}
    </Draggable>
  )
}

import React, { FunctionComponent } from 'react'
import { Droppable } from 'react-beautiful-dnd'

import { useItems } from '../hooks'
import { styled } from '../stitches.config'
import { ItemCard } from './item'
import { Spinner } from './spinner'

const Main = styled('div', {
  height: 'calc(100vh - 14rem)',
  overflowY: 'auto'
})

interface Props {
  id: number
}

export const ItemList: FunctionComponent<Props> = ({ children, id }) => {
  const { items, loading } = useItems(id)

  if (loading) {
    return <Spinner />
  }

  return (
    <Droppable droppableId={`list-${id}`} type="item">
      {({ droppableProps, innerRef, placeholder }) => (
        <div ref={innerRef} {...droppableProps}>
          <Main>
            {children}
            {items.map((item, index) => (
              <ItemCard index={index} item={item} key={item.id} listId={id} />
            ))}
          </Main>
          {placeholder}
        </div>
      )}
    </Droppable>
  )
}

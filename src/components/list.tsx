import { sortBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { Droppable } from 'react-beautiful-dnd'

import { useList } from '../hooks'
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
  const { list } = useList(id)

  if (!list) {
    return <Spinner />
  }

  return (
    <Droppable droppableId={`list-${id}`} type="item">
      {({ droppableProps, innerRef, placeholder }) => (
        <div ref={innerRef} {...droppableProps}>
          <Main>
            {children}
            {sortBy(list.items, 'complete').map((item, index) => (
              <ItemCard index={index} item={item} key={item.id} list={list} />
            ))}
          </Main>
          {placeholder}
        </div>
      )}
    </Droppable>
  )
}

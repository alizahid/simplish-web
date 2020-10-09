import { cloneDeep } from 'lodash'
import React, { FunctionComponent, useState } from 'react'

import { styled } from '../stitches.config'

const Main = styled('div', {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  margin: '-$half'
})

const Tag = styled('div', {
  color: '$foreground',
  cursor: 'pointer',
  margin: '$half'
})

const Input = styled('input', {
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  color: '$foreground',
  flex: 1,
  fontFamily: '$sans',
  fontSize: '$regular',
  margin: '$half'
})

interface Props {
  className?: string
  tags: string[]

  onChange: (tags: string[]) => void
}

export const Tags: FunctionComponent<Props> = ({
  className,
  onChange,
  tags
}) => {
  const [tag, setTag] = useState('')

  return (
    <Main className={className}>
      {tags.map((tag, index) => (
        <Tag
          key={tag}
          onClick={(event) => {
            event.preventDefault()

            const next = cloneDeep(tags)

            next.splice(index, 1)

            onChange(next)
          }}>
          {tag}
        </Tag>
      ))}
      <Input
        onChange={(event) => setTag(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            if (tags.includes(tag)) {
              return
            }

            onChange([...tags, tag])

            event.preventDefault()

            setTag('')
          }
        }}
        placeholder="Tag"
        value={tag}
      />
    </Main>
  )
}

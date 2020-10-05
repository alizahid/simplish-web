import { TCssProp } from '@stitches/react'
import { parseDate } from 'chrono-node'
import dayjs from 'dayjs'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

import { styled } from '../stitches.config'
import { Board, Item, List } from '../types/graphql'

const Main = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
})

const Date = styled('div', {
  color: '$foregroundLight',
  fontSize: '$small',
  marginTop: '$padding'
})

const Input = styled('input', {
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  color: '$foreground',
  fontFamily: '$sans',
  lineHeight: '$regular',
  width: '100%'
})

interface Props {
  autoFocus?: boolean
  board?: Board
  css?: TCssProp<never>
  item?: Item
  list?: List
  placeholder?: string
  type: 'list' | 'item' | 'board'

  onBoard?: (text: string) => void
  onCancel?: () => void
  onItem?: (text: string, date?: string) => void
  onList?: (text: string) => void
}

export const Form: FunctionComponent<Props> = ({
  autoFocus,
  board,
  css,
  item,
  list,
  onBoard,
  onCancel,
  onItem,
  onList,
  placeholder,
  type
}) => {
  const [text, setText] = useState(
    board?.name ?? item?.body ?? list?.name ?? ''
  )
  const [date, setDate] = useState(
    item?.date ? dayjs(item.date).format('lll') : ''
  )

  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!onCancel) {
      return
    }

    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onCancel()
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [onCancel])

  const parsed = parseDate(date)
  const formatted = parsed ? dayjs(parsed).format('lll') : undefined

  const submit = () => {
    if (!text) {
      return
    }

    if (type === 'board' && onBoard) {
      onBoard(text)

      setText('')
    }

    if (type === 'item' && onItem) {
      onItem(text, parsed ? dayjs(parsed).toISOString() : undefined)

      setText('')
      setDate('')
    }

    if (type === 'list' && onList) {
      onList(text)

      setText('')
    }
  }

  return (
    <Main
      css={css as Record<string, unknown>}
      onSubmit={(event) => {
        event.preventDefault()

        submit()
      }}
      ref={ref}>
      <Input
        autoFocus={autoFocus}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={text}
      />
      {type === 'item' && (
        <>
          <Input
            css={{
              fontSize: '$small',
              lineHeight: '$small',
              marginTop: '$half'
            }}
            onChange={(event) => setDate(event.target.value)}
            placeholder="Add date: eg, tomorrow at noon"
            type="text"
            value={date}
          />
          {formatted && date !== formatted && <Date>{formatted}</Date>}
        </>
      )}
      <input
        style={{
          bottom: '200%',
          position: 'absolute',
          right: '200%'
        }}
        type="submit"
      />
    </Main>
  )
}

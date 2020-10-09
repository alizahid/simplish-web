import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'

import { css, styled } from '../stitches.config'
import { Snippet } from '../types/graphql'
import { Icon } from './icon'

const Main = styled('aside', {
  height: 'calc(100vh - 14rem)',
  overflowY: 'auto',
  width: '$list'
})

const Link = styled(NavLink, {
  '&.active': {
    color: '$foreground'
  },
  '&:first-child': {
    marginTop: 0
  },
  ':hover .item-actions': {
    opacity: 1
  },

  alignItems: 'center',
  color: '$foregroundLight',
  display: 'flex',
  marginTop: '$margin',
  position: 'relative'
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
  snippets: Snippet[]

  onDelete: (id: number) => void
}

export const Snippets: FunctionComponent<Props> = ({ onDelete, snippets }) => (
  <Main>
    <Link to="/snippets/new">New</Link>
    {snippets.map((snippet) => (
      <Link
        key={snippet.id}
        onClick={(event) => {
          if (event.target !== event.currentTarget) {
            event.preventDefault()
          }
        }}
        to={`/snippets/${snippet.id}`}>
        {snippet.name}
        <Actions className="item-actions">
          <Icon
            className={css({
              cursor: 'pointer'
            })}
            icon="remove"
            onClick={() => onDelete(snippet.id)}
          />
        </Actions>
      </Link>
    ))}
  </Main>
)

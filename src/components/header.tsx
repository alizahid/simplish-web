import React, { FunctionComponent, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { useBoards } from '../hooks'
import { styled } from '../stitches.config'
import { useAuth } from '../store'
import { Icon } from './icon'
import { Spinner } from './spinner'

const Main = styled('header', {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '$space'
})

const Simplish = styled(Link, {
  alignItems: 'center',
  display: 'flex'
})

const Logo = styled('div', {
  backgroundColor: '$foreground',
  borderRadius: '$logo',
  height: '$logo',
  width: '$logo'
})

const Title = styled('div', {
  color: '$foreground',
  fontSize: '1.25em',
  fontWeight: '$medium',
  marginLeft: '$padding'
})

const Nav = styled('nav', {
  alignItems: 'center',
  display: 'flex'
})

const Hyperlink = styled(NavLink, {
  '&.active, &:hover': {
    color: '$foreground'
  },

  color: '$foregroundLight',
  fontWeight: '$medium',
  marginLeft: '$margin'
})

const Menu = styled('div', {
  position: 'relative'
})

const MenuItems = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  opacity: 0,
  paddingTop: '$padding',
  position: 'absolute',
  right: 0,
  top: '100%',
  transition: '0.2s',
  variants: {
    open: {
      true: {
        opacity: 1,
        visibility: 'visible'
      }
    }
  },
  visibility: 'hidden',
  zIndex: 10
})

const MenuItem = styled(NavLink, {
  '&.active, &:hover': {
    color: '$foreground'
  },
  color: '$foregroundLight',
  marginTop: '$padding',
  textAlign: 'right'
})

export const Header: FunctionComponent = () => {
  const [{ loggedIn, theme }, { logout, setTheme }] = useAuth()

  const { boards, loading } = useBoards()

  const [visible, setVisible] = useState(false)

  return (
    <Main>
      <Simplish to="/">
        <Logo />
        <Title>Simplish</Title>
      </Simplish>
      <Nav>
        <Icon
          css={{
            cursor: 'pointer'
          }}
          icon={theme === 'dark' ? 'sun' : 'moon'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
        {loggedIn ? (
          <>
            <Hyperlink to="/lists">Lists</Hyperlink>
            <Menu
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}>
              <Hyperlink to="/boards">Boards</Hyperlink>
              <MenuItems open={visible}>
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {boards.map((board) => (
                      <MenuItem key={board.id} to={`/boards/${board.id}`}>
                        {board.name}
                      </MenuItem>
                    ))}
                  </>
                )}
              </MenuItems>
            </Menu>
            <Hyperlink to="/snippets">Snippets</Hyperlink>
            <Hyperlink
              onClick={(event) => {
                event.preventDefault()

                logout()
              }}
              to="/sign-out">
              Sign out
            </Hyperlink>
          </>
        ) : (
          <Hyperlink to="/sign-in">Sign in</Hyperlink>
        )}
      </Nav>
    </Main>
  )
}

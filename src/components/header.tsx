import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'

import { styled } from '../stitches.config'
import { useAuth } from '../store'
import { Icon } from './icon'

const Main = styled('header', {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '$space'
})

const Simplish = styled('div', {
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

const Link = styled(NavLink, {
  '&.active, &:hover': {
    color: '$foreground'
  },

  color: '$foregroundLight',
  fontWeight: '$medium',
  marginLeft: '$margin'
})

export const Header: FunctionComponent = () => {
  const [{ loggedIn, theme }, { logout, setTheme }] = useAuth()

  return (
    <Main>
      <Simplish>
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
        {loggedIn && (
          <>
            <Link to="/lists">Lists</Link>
            <Link to="/boards">Boards</Link>
            <Link
              onClick={(event) => {
                event.preventDefault()

                logout()
              }}
              to="/sign-out">
              Sign out
            </Link>
          </>
        )}
      </Nav>
    </Main>
  )
}

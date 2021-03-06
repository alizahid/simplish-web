import { ApolloProvider } from '@apollo/client'
import React, { FunctionComponent, useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Header, Message } from './components'
import { client } from './lib'
import { Board, Boards, Landing, Lists, SignIn, Snippets } from './scenes'
import { darkTheme, styled } from './stitches.config'
import { useAuth } from './store'

const Page = styled('main', {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  marginLeft: '$space',
  marginRight: '$space'
})

export const Simplish: FunctionComponent = () => {
  const [{ loggedIn, theme }] = useAuth()

  useEffect(() => {
    document.body.className = theme === 'dark' ? darkTheme : ''
  }, [theme])

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Header />
          <Page>
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              <Route exact path="/sign-in">
                {loggedIn ? <Redirect to="/lists" /> : <SignIn />}
              </Route>
              <Route exact path="/boards">
                {loggedIn ? <Boards /> : <Redirect to="/sign-in" />}
              </Route>
              <Route path="/boards/:id">
                {loggedIn ? <Board /> : <Redirect to="/sign-in" />}
              </Route>
              <Route path="/lists">
                {loggedIn ? <Lists /> : <Redirect to="/sign-in" />}
              </Route>
              <Route path="/snippets">
                {loggedIn ? <Snippets /> : <Redirect to="/sign-in" />}
              </Route>
              <Route>
                <Message
                  message="We can't find what you're looking for. Someone is on it, though."
                  title="404"
                />
              </Route>
            </Switch>
          </Page>
        </>
      </BrowserRouter>
    </ApolloProvider>
  )
}

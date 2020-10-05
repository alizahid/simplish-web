import { ApolloProvider } from '@apollo/client'
import React, { FunctionComponent, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Header } from './components'
import { client } from './lib'
import { Landing, Lists } from './scenes'
import { darkTheme, styled } from './stitches.config'
import { useAuth } from './store'

const Layout = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh'
})

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
        <Layout>
          <Header />
          <Page>
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              {loggedIn && (
                <Route path="/lists">
                  <Lists />
                </Route>
              )}
            </Switch>
          </Page>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  )
}

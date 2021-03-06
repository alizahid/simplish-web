import React, { FunctionComponent, useState } from 'react'

import { Icon, Spinner } from '../components'
import { useSignIn } from '../hooks'
import { firebase } from '../lib'
import { styled } from '../stitches.config'

const Title = styled('h1', {
  color: '$foreground',
  fontSize: '$title',
  fontWeight: '$semibold',
  marginBottom: '$margin'
})

const Button = styled('a', {
  alignItems: 'center',
  alignSelf: 'flex-start',
  display: 'flex',
  div: {
    marginLeft: '$padding'
  },
  marginTop: '$margin',
  svg: {
    marginRight: '$padding'
  }
})

export const SignIn: FunctionComponent = () => {
  const { loading, signIn } = useSignIn()

  const [fetching, setFetching] = useState(false)

  return (
    <>
      <Title>Sign in</Title>
      <Button
        href="#google"
        onClick={async (event) => {
          event.preventDefault()

          if (loading || fetching) {
            return
          }

          setFetching(true)

          try {
            const provider = new firebase.auth.GoogleAuthProvider()

            const { user } = await firebase.auth().signInWithPopup(provider)

            if (!user) {
              return
            }

            const token = await user.getIdToken()

            signIn(token)
          } finally {
            setFetching(false)
          }
        }}>
        <Icon icon="google" />
        Sign in with Google
        {(loading || fetching) && <Spinner />}
      </Button>
    </>
  )
}

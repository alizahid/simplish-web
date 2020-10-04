import React, { FunctionComponent } from 'react'
import { Redirect } from 'react-router-dom'

import { useAuth } from '../store'

export const Landing: FunctionComponent = () => {
  const [{ loggedIn }] = useAuth()

  if (loggedIn) {
    return <Redirect to="/lists" />
  }

  return <div>Landing</div>
}

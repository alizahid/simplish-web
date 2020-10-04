import React, { FunctionComponent } from 'react'
import { Redirect } from 'react-router-dom'

import { ItemBoard, Spinner } from '../components'
import { useLists } from '../hooks'
import { useAuth } from '../store'

export const Lists: FunctionComponent = () => {
  const [{ loggedIn }] = useAuth()

  const { lists, loading } = useLists()

  if (!loggedIn) {
    return <Redirect to="/" />
  }

  if (loading) {
    return <Spinner size="large" />
  }

  return <ItemBoard lists={lists} />
}

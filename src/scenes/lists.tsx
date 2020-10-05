import React, { FunctionComponent } from 'react'

import { ItemBoard, Spinner } from '../components'
import { useLists } from '../hooks'

export const Lists: FunctionComponent = () => {
  const { lists, loading } = useLists()

  if (loading) {
    return <Spinner size="large" />
  }

  return <ItemBoard lists={lists} />
}

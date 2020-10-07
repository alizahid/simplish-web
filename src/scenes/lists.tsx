import React, { FunctionComponent } from 'react'

import { ItemBoard, Spinner } from '../components'
import { useLists, usePageTitle } from '../hooks'

export const Lists: FunctionComponent = () => {
  usePageTitle('Lists / Simplish')

  const { lists, loading } = useLists()

  if (loading) {
    return <Spinner size="large" />
  }

  return <ItemBoard lists={lists} />
}

import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'

import { ItemBoard, Spinner } from '../components'
import { useLists } from '../hooks'

export const Lists: FunctionComponent = () => {
  const { lists, loading } = useLists()

  if (loading) {
    return <Spinner size="large" />
  }

  return (
    <DocumentTitle title="Lists / Simplish">
      <ItemBoard lists={lists} />
    </DocumentTitle>
  )
}

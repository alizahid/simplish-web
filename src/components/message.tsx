import React, { FunctionComponent } from 'react'

import { styled } from '../stitches.config'

const Title = styled('h1', {
  fontSize: '$title',
  fontWeight: '$semibold'
})

const Body = styled('div', {
  marginTop: '$padding'
})

interface Props {
  message: string
  title?: string
}

export const Message: FunctionComponent<Props> = ({
  message,
  title = 'Error'
}) => (
  <>
    <Title>{title}</Title>
    <Body>{message}</Body>
  </>
)

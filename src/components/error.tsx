import React, { FunctionComponent } from 'react'

import { styled } from '../stitches.config'

const Title = styled('h1', {
  fontSize: '$title',
  fontWeight: '$semibold'
})

const Message = styled('div', {
  marginTop: '$padding'
})

interface Props {
  message: string
  title?: string
}

export const Error: FunctionComponent<Props> = ({
  message,
  title = 'Error'
}) => (
  <>
    <Title>{title}</Title>
    <Message>{message}</Message>
  </>
)

import React, { FunctionComponent } from 'react'

import { css, styled } from '../stitches.config'

const rotate = css.keyframes({
  '0%': {
    transform: 'rotate(0deg)'
  },
  '100%': {
    transform: 'rotate(360deg)'
  }
})

const Main = styled('div', {
  animation: `${rotate} 0.5s linear infinite`,
  borderColor: '$foregroundLight',
  borderRadius: '$full',
  borderStyle: 'solid',
  borderTopColor: '$foreground',

  variants: {
    size: {
      large: {
        borderWidth: '$thick',
        height: '$spinnerLarge',
        width: '$spinnerLarge'
      },
      small: {
        borderWidth: '$thin',
        height: '$spinner',
        width: '$spinner'
      }
    }
  }
})

interface Props {
  size?: 'small' | 'large'
}

export const Spinner: FunctionComponent<Props> = ({ size = 'small' }) => (
  <Main size={size} />
)

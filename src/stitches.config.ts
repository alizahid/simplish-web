import { createStyled } from '@stitches/react'

export const { css, styled } = createStyled({
  tokens: {
    borderWidths: {
      $thick: '2px',
      $thin: '1px'
    },
    colors: {
      $background: '#eee',
      $backgroundDark: '#ccc',
      $error: '#ff3b30',
      $foreground: '#000',
      $foregroundLight: '#666',
      $message: '#007aff',
      $success: '#4cd964'
    },
    fontSizes: {
      $regular: '1rem',
      $small: '0.875rem',
      $subtitle: '1.5rem',
      $title: '2rem'
    },
    fontWeights: {
      $medium: '500',
      $regular: '400',
      $semibold: '600'
    },
    fonts: {
      $mono: 'IBM Plex Mono, Consolas, monospace',
      $sans: 'Inter, apple-system, sans-serif'
    },
    lineHeights: {
      $code: '1.6rem',
      $regular: '1.5rem',
      $small: '1rem',
      $subtitle: '2rem',
      $title: '2.5rem'
    },
    radii: {
      $full: '100%',
      $large: '0.5rem',
      $logo: '2rem',
      $small: '0.25rem'
    },
    shadows: {
      $small: '0 1px 0.125em rgba(0, 0, 0, 0.05)'
    },
    sizes: {
      $icon: '1rem',
      $list: '24rem',
      $logo: '2rem',
      $spinner: '1rem',
      $spinnerLarge: '2rem'
    },
    space: {
      $half: '0.5rem',
      $margin: '2rem',
      $padding: '1rem',
      $space: '4rem'
    },
    transitions: {
      $smooth: 'all 0.2s'
    }
  }
})

export const darkTheme = css.theme({
  colors: {
    $background: '#131516',
    $backgroundDark: '#222',
    $foreground: '#eee',
    $foregroundLight: '#666'
  }
})

css.global({
  a: {
    '&:active': {
      color: '$foreground'
    },
    '&:hover': {
      color: '$foregroundLight'
    },

    color: '$foreground',
    textDecoration: 'none',
    transition: '$smooth'
  },
  body: {
    backgroundColor: '$background',
    transition: '$smooth'
  }
})

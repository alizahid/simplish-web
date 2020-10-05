import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'

import { styled } from '../stitches.config'
import { useAuth } from '../store'

const Title = styled('h1', {
  color: '$foreground',
  fontSize: '$title',
  fontWeight: '$semibold'
})

const Subtitle = styled('h2', {
  color: '$foreground',
  fontSize: '$subtitle',
  fontWeight: '$semibold',
  marginTop: '$space'
})

const Copy = styled('div', {
  color: '$foreground',
  marginTop: '$padding'
})

const Image = styled('img', {
  filter: 'brightness(1.05)',
  marginTop: '$margin',
  width: '60rem'
})

const Footer = styled('div', {
  alignItems: 'center',
  color: '$foregroundLight',
  display: 'flex',
  fontSize: '$small',
  marginBottom: '$space',
  marginTop: '$space'
})

export const Landing: FunctionComponent = () => {
  const [{ theme }] = useAuth()

  return (
    <>
      <DocumentTitle title="Simplish" />

      <Title>Dead simple lists</Title>
      <Subtitle>Lists</Subtitle>
      <Copy>
        Simplish lists are beautiful and minimal. Your lists are stacked
        horizontally and you can drag and drop items across them.
      </Copy>
      <Image src={`/screenshots/${theme}-lists.png`} />
      <Subtitle>Boards</Subtitle>
      <Copy>
        Simplish baords are collections of lists, like a kanban board.
      </Copy>
      <Image src={`/screenshots/${theme}-boards.png`} />
      <Subtitle>Dark mode</Subtitle>
      <Copy>
        It&apos;s 2020, so a dark mode is available. Switch from the top right
        menu.
      </Copy>
      <Subtitle>Collaboration</Subtitle>
      <Copy>Coming soon.</Copy>
      <Subtitle>Mobile</Subtitle>
      <Copy>
        The Simplish website doesn&apos;t support mobile browsers, but an app is
        in the works.
      </Copy>

      <Footer>
        &copy; {new Date().getFullYear()} / Built with
        <img
          src="/heart.svg"
          style={{
            height: '1.5rem',
            marginLeft: '0.25rem',
            marginRight: '0.25rem',
            verticalAlign: 'top',
            width: '1.5rem'
          }}
        />
        by
        <a
          href="https://alizahid.dev"
          rel="noreferrer"
          style={{
            marginLeft: '0.25rem'
          }}
          target="_blank">
          Ali Zahid
        </a>
      </Footer>
    </>
  )
}

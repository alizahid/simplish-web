import './syntax.scss'

import { highlight, languages } from 'prismjs'
import React, { FunctionComponent, useEffect, useState } from 'react'
import Editor from 'react-simple-code-editor'

import 'prismjs/components/prism-typescript'

import { css, styled } from '../stitches.config'
import { Snippet, SnippetInput } from '../types/graphql'
import { Tags } from './tags'

const Main = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 14rem)',
  marginLeft: '$space',
  width: '100%'
})

const Header = styled('header', {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '$margin'
})

const Name = styled('input', {
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  color: '$foreground',
  flex: 1,
  fontSize: '$subtitle',
  fontWeight: '$medium'
})

const Languages = styled('select', {
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  color: '$foreground',
  marginLeft: '$margin',
  textAlign: 'right'
})

const Content = styled('div', {
  color: '$foreground',
  flex: 1,
  overflowY: 'auto'
})

const Footer = styled('div', {
  display: 'flex',
  marginTop: '$margin'
})

const Button = styled('a', {
  fontWeight: '$medium',
  marginRight: '$margin'
})

interface Props {
  snippet?: Snippet

  onCreate?: (data: SnippetInput) => void
  onSave?: (snippet: Snippet, data: SnippetInput) => void
}

export const CodeEditor: FunctionComponent<Props> = ({
  onCreate,
  onSave,
  snippet
}) => {
  const [name, setName] = useState(snippet?.name ?? '')
  const [language, setLanguage] = useState(snippet?.language ?? 'text')
  const [content, setContent] = useState(snippet?.content ?? '')
  const [tags, setTags] = useState(snippet?.tags ?? [])

  useEffect(() => {
    if (snippet) {
      setName(snippet.name)
      setContent(snippet.content)
      setLanguage(snippet.language)
      setTags(snippet.tags)
    } else {
      setName('')
      setContent('')
      setLanguage('text')
      setTags([])
    }
  }, [snippet])

  const styles = css({
    fontFamily: '$mono',
    fontSize: '$regular',
    lineHeight: '$code',
    minHeight: '100%'
  })

  return (
    <Main>
      <Header>
        <Name
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          spellCheck={false}
          type="text"
          value={name}
        />
        <Languages
          dir="rtl"
          onChange={(event) => setLanguage(event.target.value)}
          value={language}>
          <option value="text">Plain text</option>
          <option value="typescript">TypeScript</option>
        </Languages>
      </Header>
      <Content>
        <Editor
          autoFocus
          className={styles}
          highlight={(content) => {
            if (language === 'text') {
              return content
            }

            return highlight(content, languages.typescript, language)
          }}
          onValueChange={(content) => setContent(content)}
          placeholder="Content"
          value={content}
        />
      </Content>
      <Tags
        className={css({
          marginTop: '$margin'
        })}
        onChange={(tags) => setTags(tags)}
        tags={tags}
      />
      <Footer>
        <Button
          href="#save"
          onClick={(event) => {
            event.preventDefault()

            if (!name || !content) {
              return
            }

            if (onCreate) {
              onCreate({
                content,
                language,
                name,
                tags
              })
            }

            if (snippet && onSave) {
              onSave(snippet, {
                content,
                language,
                name,
                tags
              })
            }
          }}>
          Save
        </Button>
      </Footer>
    </Main>
  )
}

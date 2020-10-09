import React, { FunctionComponent } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

import { CodeEditor, Snippets as List, Spinner } from '../components'
import {
  useCreateSnippet,
  useDeleteSnippet,
  usePageTitle,
  useSnippets,
  useUpdateSnippet
} from '../hooks'
import { styled } from '../stitches.config'

const Main = styled('div', {
  display: 'flex'
})

export const Snippets: FunctionComponent = () => {
  const { push } = useHistory()

  const { loading, snippets } = useSnippets()

  const { createSnippet } = useCreateSnippet()
  const { deleteSnippet } = useDeleteSnippet()
  const { updateSnippet } = useUpdateSnippet()

  usePageTitle('Boards / Simplish')

  if (loading) {
    return <Spinner size="large" />
  }

  return (
    <Main>
      <List
        onDelete={(id) => {
          deleteSnippet(id)

          push('/snippets')
        }}
        snippets={snippets}
      />
      <Switch>
        <Route
          exact
          path="/snippets/new"
          render={() => (
            <CodeEditor
              onCreate={async (data) => {
                const id = await createSnippet(data)

                if (id) {
                  push(`/snippets/${id}`)
                }
              }}
            />
          )}
        />
        <Route
          path="/snippets/:id"
          render={(props) => {
            const snippet = snippets.find(
              ({ id }) => id === Number(props.match.params.id)
            )

            if (!snippet) {
              return <Spinner />
            }

            return (
              <CodeEditor
                onSave={(data) => {
                  if (!snippet) {
                    return
                  }

                  updateSnippet(snippet, data)
                }}
                snippet={snippet}
              />
            )
          }}
        />
      </Switch>
    </Main>
  )
}

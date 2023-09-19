import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import hljs from 'highlight.js'
import React from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { stringify } from 'yaml'

const CodeContainer = styled.pre`
  background-color: #193549;
  margin: 0;
  padding: 0.25rem 0.5rem;

  & .hljs-string {
    color: #a5ff90;
  }

  & .hljs-literal,
  & .hljs-number {
    color: #f53b6e;
  }

  & .hljs-attr,
  & .hljs-bullet {
    color: #99ffff;
  }
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
  justify-content: flex-end;
`

const YamlView = (props: { document: TGenericObject }) => {
  const { document } = props
  const asYAML: string = stringify(document)
  const highlighted = hljs.highlight(asYAML, { language: 'yaml' })

  return (
    <div>
      <ButtonRow>
        <Button
          variant="outlined"
          onClick={() => {
            navigator.clipboard.writeText(asYAML)
            toast.success('Copied!')
          }}
        >
          Copy as YAML
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(document))
            toast.success('Copied!')
          }}
        >
          Copy as JSON
        </Button>
      </ButtonRow>
      <CodeContainer>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </CodeContainer>
    </div>
  )
}

export const YamlPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  // eslint-disable-next-line
  const [document, loading, updateDocument, error] =
    useDocument<TGenericObject>(idReference, 999)
  if (loading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  return <YamlView document={document || {}} />
}

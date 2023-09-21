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
import YAML from 'yaml'

const CodeContainer = styled.pre`
  background-color: #193549;
  margin: 0;
  padding: 1rem;
  border-radius: 0.5rem;

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
  const asYAML: string = YAML.stringify(document)
  const asJSON: string = JSON.stringify(document)
  const highlighted = hljs.highlight(asYAML, { language: 'yaml' })

  const onClick = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  return (
    <div>
      <ButtonRow>
        <Button variant="outlined" onClick={() => onClick(asYAML)}>
          Copy as YAML
        </Button>
        <Button variant="outlined" onClick={() => onClick(asJSON)}>
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

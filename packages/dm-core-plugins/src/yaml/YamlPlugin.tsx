import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import hljs from 'highlight.js'
import yaml from 'highlight.js/lib/languages/yaml'
import React from 'react'
import { toast } from 'react-toastify'
import { stringify } from 'yaml'
import './index.css'

hljs.registerLanguage('yaml', yaml)

const YamlView = (props: { document: TGenericObject }) => {
  const { document } = props
  const asYAML: string = stringify(document)
  const highlighted = hljs.highlight(asYAML, { language: 'yaml' })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
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
        </div>
      </div>
      <pre style={{ backgroundColor: '#193549', color: 'coral', margin: '0' }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
      </pre>
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

import React from 'react'
import {
  JsonView,
  Button,
  useDocument,
  Loading,
  IUIPlugin,
  TGenericObject,
} from '@development-framework/dm-core'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading] = useDocument<TGenericObject>(idReference)
  const infoText: string = ''
  if (loading || document === null) {
    return <Loading />
  }
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#9e4949',
        }}
      >
        {infoText && <small>{infoText}</small>}
        <CopyToClipboard text={JSON.stringify(document)}>
          <Button style={{ marginBottom: '5px' }}>Copy</Button>
        </CopyToClipboard>
      </div>

      <JsonView data={document} />
    </div>
  )
}

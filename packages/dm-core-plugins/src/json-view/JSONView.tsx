import React from 'react'
import {
  Button,
  IUIPlugin,
  JsonView,
  Loading,
  TValidEntity,
  useDocument,
} from '@development-framework/dm-core'

// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'

type TPreviewProps = {
  idReference: string
}

export default (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading] = useDocument<TValidEntity>(idReference)
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

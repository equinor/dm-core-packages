import {
  IUIPlugin,
  JsonView,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { toast } from 'react-toastify'

export default (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading] = useDocument<TGenericObject>(idReference)
  if (loading || document === null) {
    return <Loading />
  }
  return (
    <div>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(document))
          toast.success('Copied!')
        }}
      >
        Copy
      </Button>

      <JsonView data={document} />
    </div>
  )
}

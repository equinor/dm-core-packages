import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
  IUIPlugin,
  Loading,
  splitAddress,
  TGenericObject,
} from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

export const PdfPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [document, loading, _, error] = useDocument<TGenericObject>(
    idReference,
    999
  )
  const dataSource = splitAddress(idReference).dataSource

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (loading || document === null) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSource} />
}

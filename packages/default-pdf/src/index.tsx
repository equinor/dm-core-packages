import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
  EPluginType,
  IDmtUIPlugin,
  Loading,
} from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

const PluginComponent = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading] = useDocument(dataSourceId, documentId, 999)

  if (loading) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSourceId} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]

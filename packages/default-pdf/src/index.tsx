import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import { EPluginType, IUIPlugin, Loading } from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

const PluginComponent = (props: IUIPlugin) => {
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

import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import { EPluginType, IUIPlugin, Loading } from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

const PluginComponent = (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading] = useDocument(idReference, 999)
  const dataSource = idReference.split('/')[0]

  if (loading) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSource} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]

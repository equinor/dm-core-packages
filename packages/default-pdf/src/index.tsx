import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TPlugin,
} from '@development-framework/dm-core'
import { useDocument } from '@development-framework/dm-core'

const PluginComponent = (props: IUIPlugin) => {
  const { idReference } = props
  const [document, loading] = useDocument<TGenericObject>(idReference, 999)
  const dataSource = idReference.split('/')[0]

  if (loading || document === null) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSource} />
}

export const plugins: TPlugin[] = [
  {
    pluginName: 'default-pdf',
    component: PluginComponent,
  },
]

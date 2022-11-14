import React from 'react'

import { EPluginType, IDmtUIPlugin } from '@development-framework/dm-core'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: IDmtUIPlugin) => {
  return (
    <PreviewPlugin
      documentId={props.documentId}
      dataSourceId={props.dataSourceId}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]

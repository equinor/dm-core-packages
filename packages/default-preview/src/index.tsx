import React from 'react'

import { EPluginType, IUIPlugin } from '@development-framework/dm-core'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: IUIPlugin) => {
  return <PreviewPlugin idReference={props.idReference} />
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: EPluginType.UI,
    component: PluginComponent,
  },
]

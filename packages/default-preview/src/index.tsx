import React from 'react'

import { IUIPlugin, TPlugin } from '@development-framework/dm-core'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: IUIPlugin) => {
  return <PreviewPlugin idReference={props.idReference} />
}

export const plugins: TPlugin[] = [
  {
    pluginName: 'default-preview',
    component: PluginComponent,
  },
]

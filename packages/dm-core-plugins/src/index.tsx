import { TPlugin, IUIPlugin } from '@development-framework/dm-core'
import React from 'react'
import Editor from './Editor'

export const plugins: TPlugin[] = [
  {
    pluginName: 'tabs99',
    component: Editor,
  },
]

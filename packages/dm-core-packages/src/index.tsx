import {TPlugin} from '@development-framework/dm-core'
import Editor from './explorer/Editor'

export const plugins: TPlugin[] = [
  {
    pluginName: 'explorer',
    component: Editor,
  },
]

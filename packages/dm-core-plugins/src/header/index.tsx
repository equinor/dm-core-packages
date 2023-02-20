import { TPlugin } from '@development-framework/dm-core'
import Header from './Header'

export const plugins: TPlugin[] = [
  {
    pluginName: 'header',
    component: Header,
  },
]

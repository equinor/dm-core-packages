import { TPlugin } from '@development-framework/dm-core'
import { TabsContainer } from './TabsContainer'

export const plugins: TPlugin[] = [
  {
    pluginName: 'tabs',
    component: TabsContainer,
  },
]

import { EPluginType } from '@development-framework/dm-core'
import { TabsContainer } from './TabsContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: EPluginType.UI,
    component: TabsContainer,
  },
]

import { EPluginType, TPlugin } from '@development-framework/dm-core'
import { TabsContainer } from './TabsContainer'

export const plugins: TPlugin[] = [
  {
    pluginName: 'tabs',
    pluginType: EPluginType.UI,
    component: TabsContainer,
  },
]

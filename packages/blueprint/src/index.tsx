import { EPluginType, TPlugin } from '@development-framework/dm-core'
import { EditBlueprint } from './EditBlueprint'

export const plugins: TPlugin[] = [
  {
    pluginName: 'edit-blueprint',
    pluginType: EPluginType.UI,
    component: EditBlueprint,
  },
]

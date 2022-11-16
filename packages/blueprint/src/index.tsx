import { EPluginType } from '@development-framework/dm-core'
import { EditBlueprint } from './EditBlueprint'

export const plugins: any = [
  {
    pluginName: 'edit-blueprint',
    pluginType: EPluginType.UI,
    component: EditBlueprint,
  },
]

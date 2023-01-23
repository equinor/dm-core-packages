import {EPluginType, TPlugin} from '@development-framework/dm-core'
import Editor from "./Editor";

export const plugins: TPlugin[] = [
  {
    pluginName: 'explorer',
    pluginType: EPluginType.UI,
    component: Editor,
  },
]

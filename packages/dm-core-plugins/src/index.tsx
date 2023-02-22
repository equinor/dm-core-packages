import {TPlugin} from '@development-framework/dm-core'
import Editor from './explorer/Editor'
import {PluginComponent} from "./yaml-view/YamlPlugin";
import {TabsContainer} from "./tabs/TabsContainer";

export const plugins: TPlugin[] = [
  {
    pluginName: 'explorer',
    component: Editor,
  },
  {
    pluginName: 'yaml-view',
    component: PluginComponent,
  },
  {
    pluginName: 'tabs',
    component: TabsContainer,
  },

]

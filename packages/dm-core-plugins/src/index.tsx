import {TPlugin} from '@development-framework/dm-core'
import Editor from './explorer/Editor'
import {PluginComponent} from "./yaml-view/YamlPlugin";
import {TabsContainer} from "./tabs/TabsContainer";
import {MermaidComponent} from "./mermaid-plugin/MermaidComponent";
import {JobInputEdit} from "./job/JobInputEdit";
import {JobControlWrapper} from "./job/JobControlWrapper";

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
  {
    pluginName: 'mermaid',
    component: MermaidComponent,
  },
  {
    pluginName: 'jobControl',
    component: JobControlWrapper,
  },
  {
    pluginName: 'jobInputEdit',
    component: JobInputEdit,
  },

]

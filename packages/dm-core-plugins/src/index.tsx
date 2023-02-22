import {TPlugin} from '@development-framework/dm-core'
import Editor from './explorer/Editor'
import {PluginComponent} from "./yaml-view/YamlPlugin";
import {TabsContainer} from "./tabs/TabsContainer";
import {MermaidComponent} from "./mermaid-plugin/MermaidComponent";
import {JobInputEdit} from "./job/JobInputEdit";
import {JobControlWrapper} from "./job/JobControlWrapper";
import {FormComponent} from "./form/FormComonent";
import Header from "./header/Header";

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
  {
    pluginName: 'form',
    component: FormComponent,
  },
  {
    pluginName: 'header',
    component: Header,
  },

]

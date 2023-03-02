import { TPlugin } from '@development-framework/dm-core'

import { YamlPlugin } from './yaml/YamlPlugin'
import { TabsPlugin } from './tabs/TabsPlugin'
import { BlueprintHierarchyPlugin } from './blueprint-hierarchy/BlueprintHierarchyPlugin'
import { JobInputEditPlugin } from './job/JobInputEditPlugin'
import { JobControlPlugin } from './job/JobControlPlugin'
import { FormPlugin } from './form/FormPlugin'
import HeaderPlugin from './header/HeaderPlugin'
import { DefaultPreviewComponent } from './default-preview/DefaultPreviewComponent'
import { DefaultPdfComponent } from './default-pdf/DefaultPdfComponent'
import { EditBlueprint } from './blueprint/EditBlueprint'
import ExplorerPlugin from './explorer/ExplorerPlugin'
import { GridPlugin } from './grid/GridPlugin'

export const plugins: TPlugin[] = [
  {
    pluginName: 'explorer',
    component: ExplorerPlugin,
  },
  {
    pluginName: 'yaml',
    component: YamlPlugin,
  },
  {
    pluginName: 'grid',
    component: GridPlugin,
  },
  {
    pluginName: 'tabs',
    component: TabsPlugin,
  },
  {
    pluginName: 'blueprint-hierarchy',
    component: BlueprintHierarchyPlugin,
  },
  {
    pluginName: 'jobControl',
    component: JobControlPlugin,
  },
  {
    pluginName: 'jobInputEdit',
    component: JobInputEditPlugin,
  },
  {
    pluginName: 'form',
    component: FormPlugin,
  },
  {
    pluginName: 'header',
    component: HeaderPlugin,
  },
  {
    pluginName: 'default-preview',
    component: DefaultPreviewComponent,
  },
  {
    pluginName: 'default-pdf',
    component: DefaultPdfComponent,
  },
  {
    pluginName: 'edit-blueprint',
    component: EditBlueprint,
  },
]

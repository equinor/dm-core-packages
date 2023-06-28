import { TPlugin } from '@development-framework/dm-core'

import { YamlPlugin } from './yaml/YamlPlugin'
import { AttributeSelectorPlugin } from './attribute-selector/AttributeSelectorPlugin'
import { BlueprintHierarchyPlugin } from './blueprint-hierarchy/BlueprintHierarchyPlugin'
import { JobInputEditPlugin } from './job/JobInputEditPlugin'
import { JobControlPlugin } from './job/JobControlPlugin'
import { FormPlugin } from './form/FormPlugin'
import HeaderPlugin from './header/HeaderPlugin'
import JsonPlugin from './json/JsonPlugin'
import { PdfPlugin } from './pdf/PdfPlugin'
import { BlueprintPlugin } from './blueprint/BlueprintPlugin'
import ExplorerPlugin from './explorer/ExplorerPlugin'
import { GridPlugin } from './grid/GridPlugin'
import { GenericListPlugin } from './generic-list/GenericListPlugin'
import { TablePlugin } from './table/TablePlugin'

export const plugins: TPlugin[] = [
  {
    pluginName: '@development-framework/dm-core-plugins/explorer',
    component: ExplorerPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/generic-list',
    component: GenericListPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/table',
    component: TablePlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/yaml',
    component: YamlPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/grid',
    component: GridPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/attribute-selector',
    component: AttributeSelectorPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/blueprint-hierarchy',
    component: BlueprintHierarchyPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/jobControl',
    component: JobControlPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/jobInputEdit',
    component: JobInputEditPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/form',
    component: FormPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/header',
    component: HeaderPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/json',
    component: JsonPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/pdf',
    component: PdfPlugin,
  },
  {
    pluginName: '@development-framework/dm-core-plugins/blueprint',
    component: BlueprintPlugin,
  },
]

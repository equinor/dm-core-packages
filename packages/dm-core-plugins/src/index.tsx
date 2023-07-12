import { TPlugin } from '@development-framework/dm-core'

import { YamlPlugin } from './yaml/YamlPlugin'
import { ViewSelectorPlugin } from './view_selector/ViewSelectorPlugin'
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
import { ListPlugin } from './list/ListPlugin'
import { TablePlugin } from './table/TablePlugin'
import { FilePlugin } from './file/FilePlugin'

export const plugins: { [key: string]: TPlugin } = {
  explorer: {
    pluginName: '@development-framework/dm-core-plugins/explorer',
    component: ExplorerPlugin,
  },
  list: {
    pluginName: '@development-framework/dm-core-plugins/list',
    component: ListPlugin,
  },
  table: {
    pluginName: '@development-framework/dm-core-plugins/table',
    component: TablePlugin,
  },
  yaml: {
    pluginName: '@development-framework/dm-core-plugins/yaml',
    component: YamlPlugin,
  },
  file: {
    pluginName: '@development-framework/dm-core-plugins/file',
    component: FilePlugin,
  },
  grid: {
    pluginName: '@development-framework/dm-core-plugins/grid',
    component: GridPlugin,
  },
  view_selector: {
    pluginName: '@development-framework/dm-core-plugins/view_selector',
    component: ViewSelectorPlugin,
  },
  'blueprint-hierachy': {
    pluginName: '@development-framework/dm-core-plugins/blueprint-hierarchy',
    component: BlueprintHierarchyPlugin,
  },
  jobControl: {
    pluginName: '@development-framework/dm-core-plugins/jobControl',
    component: JobControlPlugin,
  },
  jobInputEdit: {
    pluginName: '@development-framework/dm-core-plugins/jobInputEdit',
    component: JobInputEditPlugin,
  },
  form: {
    pluginName: '@development-framework/dm-core-plugins/form',
    component: FormPlugin,
  },
  header: {
    pluginName: '@development-framework/dm-core-plugins/header',
    component: HeaderPlugin,
  },
  json: {
    pluginName: '@development-framework/dm-core-plugins/json',
    component: JsonPlugin,
  },
  pdf: {
    pluginName: '@development-framework/dm-core-plugins/pdf',
    component: PdfPlugin,
  },
  blueprint: {
    pluginName: '@development-framework/dm-core-plugins/blueprint',
    component: BlueprintPlugin,
  },
}

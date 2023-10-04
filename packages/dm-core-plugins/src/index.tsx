import { TUiPluginMap } from '@development-framework/dm-core'

import { YamlPlugin } from './yaml/YamlPlugin'
import { ViewSelectorPlugin } from './view_selector/ViewSelectorPlugin'
import { BlueprintHierarchyPlugin } from './blueprint-hierarchy/BlueprintHierarchyPlugin'
import { JobPlugin } from './job/JobPlugin'
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
import { RoleFilterPlugin } from './role_filter/RoleFilterPlugin'

export default {
  '@development-framework/dm-core-plugins/explorer': {
    component: ExplorerPlugin,
  },
  '@development-framework/dm-core-plugins/list': {
    component: ListPlugin,
  },
  '@development-framework/dm-core-plugins/table': {
    component: TablePlugin,
  },
  '@development-framework/dm-core-plugins/yaml': {
    component: YamlPlugin,
  },
  '@development-framework/dm-core-plugins/file': {
    component: FilePlugin,
  },
  '@development-framework/dm-core-plugins/grid': {
    component: GridPlugin,
  },
  '@development-framework/dm-core-plugins/view_selector': {
    component: ViewSelectorPlugin,
  },
  '@development-framework/dm-core-plugins/blueprint-hierarchy': {
    component: BlueprintHierarchyPlugin,
  },
  '@development-framework/dm-core-plugins/job/single_job': {
    component: JobPlugin,
  },
  '@development-framework/dm-core-plugins/form': {
    component: FormPlugin,
  },
  '@development-framework/dm-core-plugins/header': {
    component: HeaderPlugin,
  },
  '@development-framework/dm-core-plugins/json': {
    component: JsonPlugin,
  },
  '@development-framework/dm-core-plugins/pdf': {
    component: PdfPlugin,
  },
  '@development-framework/dm-core-plugins/blueprint': {
    component: BlueprintPlugin,
  },
  '@development-framework/dm-core-plugins/role_filter': {
    component: RoleFilterPlugin,
  },
} as TUiPluginMap

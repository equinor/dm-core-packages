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
import { BlueprintPlugin } from './blueprint/EditBlueprint'
import ExplorerPlugin from './explorer/ExplorerPlugin'

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
    pluginName: '@development-framework/dm-core-plugins/attribute-selector',
    component: AttributeSelectorPlugin,
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

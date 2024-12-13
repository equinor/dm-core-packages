import type { TUiPluginMap } from '@development-framework/dm-core'
import { lazy } from 'react'

export { WidgetProvider } from './form/context/WidgetContext'

export default {
  '@development-framework/dm-core-plugins/explorer': {
    component: lazy(() => import('./explorer/ExplorerPlugin')),
  },
  '@development-framework/dm-core-plugins/list': {
    component: lazy(() =>
      import('./list/ListPlugin').then((module) => ({
        default: module.ListPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/table': {
    component: lazy(() =>
      import('./table/TablePlugin').then((module) => ({
        default: module.TablePlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/stack': {
    component: lazy(() =>
      import('./stack/StackPlugin').then((module) => ({
        default: module.StackPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/data_grid': {
    component: lazy(() =>
      import('./data-grid/DataGridPlugin').then((module) => ({
        default: module.DataGridPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/yaml': {
    component: lazy(() =>
      import('./yaml/YamlPlugin').then((module) => ({
        default: module.YamlPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/file': {
    component: lazy(() =>
      import('./file/FilePlugin').then((module) => ({
        default: module.FilePlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/grid': {
    component: lazy(() =>
      import('./grid/GridPlugin').then((module) => ({
        default: module.GridPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/responsive_grid': {
    component: lazy(() =>
      import('./responsive_grid/ResponsiveGridPlugin').then((module) => ({
        default: module.ResponsiveGridPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/view_selector/sidebar': {
    component: lazy(() =>
      import('./view_selector/SidebarPlugin').then((module) => ({
        default: module.SidebarPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/view_selector/tabs': {
    component: lazy(() =>
      import('./view_selector/TabsPlugin').then((module) => ({
        default: module.TabsPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/single_view': {
    component: lazy(() =>
      import('./single_view/SingleViewPlugin').then((module) => ({
        default: module.SingleViewPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/blueprint-hierarchy': {
    component: lazy(() =>
      import('./blueprint-hierarchy/BlueprintHierarchyPlugin').then(
        (module) => ({
          default: module.BlueprintHierarchyPlugin,
        })
      )
    ),
  },
  '@development-framework/dm-core-plugins/job/create': {
    // TODO: Rename to job/create-from-recipe
    component: lazy(() =>
      import('./job/JobCreate').then((module) => ({
        default: module.JobCreate,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/job': {
    component: lazy(() =>
      import('./job/JobControl/JobControl').then((module) => ({
        default: module.JobControl,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/form': {
    component: lazy(() =>
      import('./form/FormPlugin').then((module) => ({
        default: module.FormPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/header': {
    component: lazy(() => import('./header/HeaderPlugin')),
  },

  '@development-framework/dm-core-plugins/json': {
    component: lazy(() => import('./json/JsonPlugin')),
  },
  '@development-framework/dm-core-plugins/blueprint': {
    component: lazy(() =>
      import('./blueprint/BlueprintPlugin').then((module) => ({
        default: module.BlueprintPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/role_filter': {
    component: lazy(() =>
      import('./role_filter/RoleFilterPlugin').then((module) => ({
        default: module.RoleFilterPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/media-viewer': {
    component: lazy(() =>
      import('./mediaViewer/MediaViewerPlugin').then((module) => ({
        default: module.MediaViewerPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/meta': {
    component: lazy(() =>
      import('./meta/MetaPlugin').then((module) => ({
        default: module.MetaPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/publish': {
    component: lazy(() =>
      import('./publish/PublishPlugin').then((module) => ({
        default: module.PublishPlugin,
      }))
    ),
  },
} as TUiPluginMap

import type { TUiPluginMap } from '@development-framework/dm-core'
import { lazy } from 'react'
import { builderStaticPlugins } from './builder/widgets'

export type {
  TBuilderPage,
  TBuilderSite,
  TNavbar,
  TNavbarItem,
} from './builder/site'

// Website builder public API.
//
// Only the lightweight, side-effect-free surface is re-exported from the
// package root so importing the plugin map stays cheap: the serializer helpers
// are pure and their module graph (`builder/widgets`) is already loaded here via
// `builderStaticPlugins`, while types are erased at runtime. The heavy editor
// component (`BuilderPlugin`) and grid renderer (`GridPlugin`) are intentionally
// NOT re-exported here to preserve lazy-loading — import them from the dedicated
// `.../builder` and `.../grid` entry points instead.
export {
  createEmptySite,
  deserializeSite,
  isSerializedSite,
  SITE_SCHEMA_VERSION,
  serializeSite,
} from './builder/site'
export type { TBuilderMode, TBuilderPluginConfig } from './builder/types'
export type { TWidgetDefinition } from './builder/widgets'
export { WidgetProvider } from './form/context/WidgetContext'

// Grid contract consumed by the builder; re-exported (type-only, free at
// runtime) so the persisted layout format has a supported public shape.
export type {
  TGridArea,
  TGridItem,
  TGridItemStyle,
  TGridPluginConfig,
  TGridSize,
  TItemBorder,
} from './grid'

export default {
  '@development-framework/dm-core-plugins/builder': {
    component: lazy(() =>
      import('./builder/BuilderPlugin').then((module) => ({
        default: module.BuilderPlugin,
      }))
    ),
  },
  '@development-framework/dm-core-plugins/builder/directory': {
    component: lazy(() =>
      import('./builder/SiteDirectoryPlugin').then((module) => ({
        default: module.SiteDirectoryPlugin,
      }))
    ),
  },
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
  // Builder "static" widgets (Heading, Button, Table, Chart, Metric, …) are
  // registered from the widget registry so adding one never touches this file.
  // See builder/widgets/index.ts and builder/ADDING_WIDGETS.md.
  ...builderStaticPlugins,
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
  '@development-framework/dm-core-plugins/markdown': {
    component: lazy(() =>
      import('./markdown/MarkdownPlugin').then((module) => ({
        default: module.MarkdownPlugin,
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

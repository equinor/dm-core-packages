/**
 * Public entry for the drag-and-drop website builder plugin.
 *
 * Importing this module pulls in the editor component and its dependencies. For
 * lightweight access to the persistence contract (serializer + types) without
 * the editor, those are also re-exported from the package root.
 *
 * Everything not re-exported here is an internal implementation detail and may
 * change without notice.
 */

// The plugin component.
export { BuilderPlugin } from './BuilderPlugin'
export type {
  TBuilderPage,
  TBuilderSite,
  TNavbar,
  TNavbarItem,
  TNavbarItemTarget,
} from './model/site'
// Persistence: the site model, its serializer and versioning. This is the
// contract stored on an entity's `layout` and validated by the Site blueprint.
export {
  createDefaultNavbar,
  createEmptySite,
  createPage,
  deserializeSite,
  isSerializedSite,
  NAVBAR_ITEM_TYPE,
  NAVBAR_TYPE,
  PAGE_TYPE,
  SITE_SCHEMA_VERSION,
  SITE_TYPE,
  serializeSite,
} from './model/site'
// The site directory (gallery of saved sites + "New site").
export { SiteDirectoryPlugin } from './SiteDirectoryPlugin'
// Plugin configuration.
export type {
  TBlock,
  TBlockCategory,
  TBuilderMode,
  TBuilderPluginConfig,
  TInspectorField,
  TInspectorFieldTarget,
  TInspectorFieldType,
} from './types'
export type { TSiteDirectoryConfig } from './types/siteDirectory'
export type { TWidgetDefinition } from './widgets'
// The widget registry contract, so custom widgets can be authored and inspected
// programmatically. See docs/ADDING_WIDGETS.md for the authoring guide.
export { BLOCKS, getBlock, WIDGET_DEFINITIONS } from './widgets'

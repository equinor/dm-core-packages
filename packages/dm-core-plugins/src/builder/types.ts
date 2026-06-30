import type { TGridArea, TGridPluginConfig } from '../grid/types'

/**
 * Editor model for the website builder.
 *
 * The model is intentionally the same shape the runtime `grid` plugin consumes
 * (`TGridPluginConfig`), so "build format == runtime format": anything authored
 * in the builder renders directly with the existing grid renderer.
 */
export type TBuilderModel = TGridPluginConfig

export type TBuilderMode = 'edit' | 'preview'

export type TBuilderPluginConfig = {
  /** Initial mode the plugin opens in. Defaults to `edit`. */
  mode?: TBuilderMode
  /** Optional seed grid config to hydrate the canvas with. */
  initialConfig?: Partial<TBuilderModel>
}

/**
 * Categories used to group blocks in the widget palette.
 */
export type TBlockCategory = 'layout' | 'content' | 'media' | 'data'

export type TInspectorFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image-upload'
  | 'table-upload'

/**
 * Where an inspector field's value is read from / written to on a grid item.
 *
 * - `scope`: the widget's data binding (`viewConfig.scope`).
 * - `label`: the widget's display label (`viewConfig.label`).
 * - `config`: a key on the inline recipe config (`viewConfig.recipe.config[key]`).
 */
export type TInspectorFieldTarget =
  | { kind: 'scope' }
  | { kind: 'label' }
  | { kind: 'config'; key: string }

/**
 * A single editable property shown in the inspector for a block. Lets users
 * configure widgets through typed form controls instead of raw JSON.
 */
export type TInspectorField = {
  label: string
  type: TInspectorFieldType
  target: TInspectorFieldTarget
  placeholder?: string
  help?: string
  /** Options for `select` fields. The stored value is the option's `value`. */
  options?: { label: string; value: string | number }[]
}

/**
 * A "block" is a draggable widget definition shown in the palette. Dropping a
 * block onto the canvas produces a grid item in the model.
 */
export type TBlock = {
  /** Stable identifier, also used as the dnd-kit draggable id in the palette. */
  id: string
  /** Friendly, human-readable name shown on the palette card. */
  label: string
  /** EDS icon name for the palette card. */
  icon: string
  category: TBlockCategory
  /** Short helper text describing what the block does. */
  description: string
  /**
   * Whether the block carries its own content (`content`) or binds to an
   * existing DMSS entity (`data`). Drives the inspector behaviour in Phase 2.
   */
  contentModel: 'content' | 'data'
  /** Default footprint (in grid cells) when first dropped. */
  defaultSize: { columns: number; rows: number }
  /** UI recipe / plugin this block renders with at runtime. */
  recipe: string
  /** Sensible default recipe config so the widget renders without setup. */
  defaultConfig?: Record<string, unknown>
  /**
   * Self-contained widgets (heading, button, divider…) render their own
   * content, so they should not receive the auto-generated title that data
   * widgets get. A redundant title also overflows small cells.
   */
  hideTitle?: boolean
  /** Block-specific properties surfaced in the inspector. */
  fields?: TInspectorField[]
}

export type { TGridArea }

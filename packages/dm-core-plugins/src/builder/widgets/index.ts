import type { IconData } from '@equinor/eds-icons'
import { type ComponentType, lazy } from 'react'
import type { TBlock } from '../types'
import { buttonWidget } from './button.widget'
import { chartWidget } from './chart.widget'
import { datePickerWidget } from './datePicker.widget'
import { dividerWidget } from './divider.widget'
import { embedWidget } from './embed.widget'
import { headingWidget } from './heading.widget'
import { imageWidget } from './image.widget'
import { metricWidget } from './metric.widget'
import { sectionWidget } from './section.widget'
import { spacerWidget } from './spacer.widget'
import { tableWidget } from './table.widget'
import { textWidget } from './text.widget'
import type { TWidgetDefinition } from './types'

/**
 * The widget registry — the single list of every widget in the palette.
 *
 * ★ To add a new widget: create a `*.widget.ts(x)` file next to this one that
 *   exports a `TWidgetDefinition`, import it above, and add it to this array.
 *   The palette card, its icon and (for static widgets) the runtime component
 *   are all wired up automatically. See `builder/ADDING_WIDGETS.md`.
 *
 * The array order is the order widgets appear within their palette category.
 */
export const WIDGET_DEFINITIONS: TWidgetDefinition[] = [
  sectionWidget,
  headingWidget,
  textWidget,
  buttonWidget,
  dividerWidget,
  spacerWidget,
  imageWidget,
  embedWidget,
  tableWidget,
  chartWidget,
  metricWidget,
  datePickerWidget,
]

/** The palette catalogue, derived from the registry. */
export const BLOCKS: TBlock[] = WIDGET_DEFINITIONS.map(
  (definition) => definition.block
)

export const getBlock = (id: string): TBlock | undefined =>
  BLOCKS.find((block) => block.id === id)

/** Icon data for every widget, keyed by `block.icon` for palette lookups. */
export const WIDGET_ICONS: Record<string, IconData> = Object.fromEntries(
  WIDGET_DEFINITIONS.map((definition) => [
    definition.block.icon,
    definition.icon,
  ])
)

/**
 * Runtime plugin-map entries for builder-owned "static" widgets, keyed by
 * recipe. Spread into the package's plugin map in `src/index.tsx`. Widgets that
 * reuse an existing plugin (no `load`) are skipped — they need no new component.
 */
export const builderStaticPlugins: Record<
  string,
  { component: ComponentType<any> }
> = Object.fromEntries(
  WIDGET_DEFINITIONS.filter((definition) => definition.load).map(
    (definition) => [
      definition.block.recipe,
      // biome-ignore lint/style/noNonNullAssertion: filtered to widgets with a loader
      { component: lazy(definition.load!) },
    ]
  )
)

export type { TWidgetDefinition }

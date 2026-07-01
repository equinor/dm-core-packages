import type { IconData } from '@equinor/eds-icons'
import type { ComponentType } from 'react'
import type { TBlock } from '../types'

/**
 * A widget definition is the single source of truth for one palette widget.
 *
 * Everything the builder needs to know about a widget lives in one file:
 * - `block`  — how it looks and behaves in the palette + inspector.
 * - `icon`   — the EDS icon rendered on its palette card.
 * - `load`   — (static widgets only) a lazy loader for the React component that
 *              renders the widget at runtime, registered under `block.recipe`.
 *
 * To add a new widget you create one `*.widget.ts(x)` file that exports one of
 * these, then add a single line to `widgets/index.ts`. Nothing else to touch.
 * See `builder/ADDING_WIDGETS.md` for a step-by-step guide.
 */
export type TWidgetDefinition = {
  /** Palette + inspector metadata. Also feeds `getBlock` / `BLOCKS`. */
  block: TBlock
  /** EDS icon shown on the palette card; keyed by `block.icon`. */
  icon: IconData
  /**
   * Lazy loader for a builder-owned "static" widget component. When present,
   * the component is registered in the runtime plugin map under `block.recipe`.
   *
   * Omit this for widgets that reuse an already-registered plugin (Section →
   * `grid`, Text → `markdown`, Image → `media-viewer`, Form → `form`, Job →
   * `job`). Those only need a palette block, not a new component.
   */
  load?: () => Promise<{ default: ComponentType<any> }>
}

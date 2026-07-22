/**
 * Public entry for the grid plugin.
 *
 * This barrel is the supported surface other packages (and the website builder)
 * should import from, rather than reaching into individual files. The builder
 * depends on this contract to render and serialize its canvas, so keeping it
 * here keeps that dependency on a stable, intentional API.
 */
export { GridPlugin } from './GridPlugin'
export type {
  TGridArea,
  TGridItem,
  TGridItemStyle,
  TGridPluginConfig,
  TGridSize,
  TItemBorder,
} from './types'

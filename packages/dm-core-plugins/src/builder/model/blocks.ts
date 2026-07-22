/**
 * The widget catalogue shown in the palette.
 *
 * This is now a thin re-export: every widget is defined in its own file under
 * `builder/widgets/` and collected in `builder/widgets/index.ts`. `BLOCKS` and
 * `getBlock` are derived from that registry so existing imports keep working.
 *
 * ★ To add a new widget, add a file under `builder/widgets/` — you do NOT edit
 *   this file. See `builder/docs/ADDING_WIDGETS.md`.
 */
export { BLOCKS, getBlock } from '../widgets'

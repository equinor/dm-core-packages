import {
  add,
  check,
  chevron_down,
  chevron_right,
  close,
  copy,
  delete_to_trash,
  desktop_mac,
  drag_handle,
  edit,
  external_link,
  format_list_bulleted,
  type IconData,
  layers,
  menu,
  phone,
  redo,
  save,
  settings,
  tablet_android,
  undo,
  visibility,
  zoom_in,
  zoom_out,
} from '@equinor/eds-icons'
import { WIDGET_ICONS } from './widgets'

/**
 * Icons used by the builder's editor chrome (toolbar, palette, outline, nav).
 *
 * Widget palette icons are NOT listed here — each widget carries its own icon
 * in its `*.widget.ts` file, and they are merged in via `WIDGET_ICONS`. That
 * means adding a new widget never requires editing this file.
 */
const CHROME_ICONS: Record<string, IconData> = {
  add,
  check,
  close,
  edit,
  visibility,
  drag_handle,
  delete_to_trash,
  copy,
  chevron_right,
  chevron_down,
  desktop_mac,
  tablet_android,
  phone,
  undo,
  redo,
  save,
  layers,
  format_list_bulleted,
  zoom_in,
  zoom_out,
  settings,
  external_link,
  menu,
}

/** Maps icon names (chrome + every widget's `block.icon`) to EDS icon data. */
export const ICONS: Record<string, IconData> = {
  ...CHROME_ICONS,
  ...WIDGET_ICONS,
}

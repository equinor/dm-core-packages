import {
  add,
  delete_to_trash,
  drag_handle,
  edit,
  type IconData,
  image,
  list,
  table_chart,
  text_field,
  view_module,
  visibility,
} from '@equinor/eds-icons'

/** Maps block icon names to EDS icon data objects used by `<Icon />`. */
export const ICONS: Record<string, IconData> = {
  view_module,
  text_field,
  image,
  table_chart,
  list,
  add,
  edit,
  visibility,
  drag_handle,
  delete_to_trash,
}

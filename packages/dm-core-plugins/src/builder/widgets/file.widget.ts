import { attach_file } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * File — upload/download a bound file entity. Reuses the runtime `file` plugin,
 * so it has no component of its own.
 */
export const fileWidget: TWidgetDefinition = {
  icon: attach_file,
  block: {
    id: 'file',
    label: 'File',
    icon: 'attach_file',
    category: 'media',
    description: 'Upload or download a bound file.',
    contentModel: 'data',
    defaultSize: { columns: 4, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/file',
  },
}

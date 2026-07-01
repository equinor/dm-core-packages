import { format_list_bulleted } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * List — a list of the entities in a bound collection, with optional add/sort/
 * delete/expand actions. Reuses the runtime `list` plugin, so it has no
 * component of its own.
 */
export const listWidget: TWidgetDefinition = {
  icon: format_list_bulleted,
  block: {
    id: 'entity-list',
    label: 'List',
    icon: 'format_list_bulleted',
    category: 'data',
    description: 'A list of entities from a bound collection.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/list',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/list/ListPluginConfig',
      headers: ['name', 'type'],
    },
    fields: [
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
      },
      {
        label: 'Compact',
        type: 'boolean',
        target: { kind: 'config', key: 'compact' },
        help: 'Show a denser list with less padding.',
      },
    ],
  },
}

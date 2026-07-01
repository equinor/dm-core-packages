import { view_list } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Data table — a table bound to a DMSS list/collection entity. Reuses the
 * runtime `table` plugin, so it has no component of its own. (For a table you
 * fill in by hand, use the self-contained "Table" widget instead.)
 */
export const dataTableWidget: TWidgetDefinition = {
  icon: view_list,
  block: {
    id: 'data-table',
    label: 'Data table',
    icon: 'view_list',
    category: 'data',
    description: 'A table bound to a list of entities from storage.',
    contentModel: 'data',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/table',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/table/TablePluginConfig',
      columns: [
        {
          type: 'PLUGINS:dm-core-plugins/table/TableColumnConfig',
          data: 'name',
          label: 'Name',
        },
        {
          type: 'PLUGINS:dm-core-plugins/table/TableColumnConfig',
          data: 'type',
          label: 'Type',
        },
      ],
      variant: [
        {
          name: 'view',
          type: 'PLUGINS:dm-core-plugins/table/TableVariantConfig',
        },
      ],
    },
    fields: [
      {
        label: 'Caption',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Optional caption shown above the table.',
      },
    ],
  },
}

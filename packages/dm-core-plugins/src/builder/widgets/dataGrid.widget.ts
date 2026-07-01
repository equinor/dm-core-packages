import { grid_on } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Data grid — a spreadsheet-style editable grid bound to a DMSS entity. Reuses
 * the runtime `data_grid` plugin, so it has no component of its own.
 */
export const dataGridWidget: TWidgetDefinition = {
  icon: grid_on,
  block: {
    id: 'data-grid',
    label: 'Data grid',
    icon: 'grid_on',
    category: 'data',
    description: 'A spreadsheet-style editable grid bound to an entity.',
    contentModel: 'data',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/data_grid',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/data_grid/DataGridPluginConfig',
      fieldNames: [],
      editable: true,
      showColumns: true,
      showRows: true,
      printDirection: 'horizontal',
    },
    fields: [
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
      },
      {
        label: 'Editable',
        type: 'boolean',
        target: { kind: 'config', key: 'editable' },
      },
      {
        label: 'Print direction',
        type: 'select',
        target: { kind: 'config', key: 'printDirection' },
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
    ],
  },
}

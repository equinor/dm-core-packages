import { table_chart } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Table — a self-contained table authored inline or imported from a file. */
export const tableWidget: TWidgetDefinition = {
  icon: table_chart,
  load: () =>
    import('../static/StaticTablePlugin').then((m) => ({
      default: m.StaticTablePlugin,
    })),
  block: {
    id: 'table',
    label: 'Table',
    icon: 'table_chart',
    category: 'data',
    description: 'A table you fill in by hand or from a CSV/Excel file.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/static-table',
    defaultConfig: {
      rows: [
        ['Column A', 'Column B'],
        ['Row 1', 'Value'],
        ['Row 2', 'Value'],
      ],
      pageSize: 25,
    },
    fields: [
      {
        label: 'Data',
        type: 'table-source',
        target: { kind: 'config', key: 'rows' },
        help: 'Write the table as markdown, or import a CSV/Excel file. Large files are paginated.',
      },
      {
        label: 'Rows per page',
        type: 'number',
        target: { kind: 'config', key: 'pageSize' },
        help: 'How many rows to show per page.',
      },
    ],
  },
}

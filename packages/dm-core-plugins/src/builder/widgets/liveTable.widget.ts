import { table_chart } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Live table — a scope-bound, viewer-editable table.
 *
 * Unlike the static Table widget (which stores its rows inline in the site
 * config), this widget reads from and writes to a DMSS entity. Bind it to an
 * entity that has a `rows: string[][]` attribute via the Data scope field in
 * the inspector. Viewers can then add rows, delete rows and edit cells and
 * click Save to persist their changes back to DMSS.
 */
export const liveTableWidget: TWidgetDefinition = {
  icon: table_chart,
  load: () =>
    import('../static/LiveTablePlugin').then((m) => ({
      default: m.LiveTablePlugin,
    })),
  block: {
    id: 'live-table',
    label: 'Live table',
    icon: 'table_chart',
    category: 'data',
    description:
      'An editable table that reads from and writes to a DMSS entity. Bind to an entity via the Data scope.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/static-live-table',
    defaultConfig: { allowAddRows: true, allowDeleteRows: true },
    hideTitle: false,
    fields: [
      {
        label: 'Caption',
        type: 'text',
        target: { kind: 'config', key: 'caption' },
        help: 'Optional heading shown above the table.',
      },
      {
        label: 'Allow viewers to add rows',
        type: 'boolean',
        target: { kind: 'config', key: 'allowAddRows' },
      },
      {
        label: 'Allow viewers to delete rows',
        type: 'boolean',
        target: { kind: 'config', key: 'allowDeleteRows' },
      },
    ],
  },
}

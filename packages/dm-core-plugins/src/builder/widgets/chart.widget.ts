import { bar_chart } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Chart — a self-contained line/bar chart drawn from an inline table. */
export const chartWidget: TWidgetDefinition = {
  icon: bar_chart,
  load: () =>
    import('../static/StaticChartPlugin').then((m) => ({
      default: m.StaticChartPlugin,
    })),
  block: {
    id: 'chart',
    label: 'Chart',
    icon: 'bar_chart',
    category: 'data',
    description: 'A line or bar chart drawn from a small table of numbers.',
    contentModel: 'content',
    defaultSize: { columns: 6, rows: 5 },
    recipe: '@development-framework/dm-core-plugins/static-chart',
    defaultConfig: {
      chartType: 'line',
      showLegend: true,
      rows: [
        ['Month', 'Sales', 'Target'],
        ['Jan', '12', '10'],
        ['Feb', '18', '14'],
        ['Mar', '9', '16'],
        ['Apr', '24', '18'],
      ],
    },
    hideTitle: true,
    fields: [
      {
        label: 'Chart title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
        help: 'Heading shown above the chart (optional).',
      },
      {
        label: 'Type',
        type: 'select',
        target: { kind: 'config', key: 'chartType' },
        options: [
          { label: 'Line', value: 'line' },
          { label: 'Bar', value: 'bar' },
        ],
      },
      {
        label: 'Data',
        type: 'table-source',
        target: { kind: 'config', key: 'rows' },
        help: 'First row is the header, first column the x-axis labels, the rest numeric series. Write it by hand or import a CSV/Excel file.',
      },
      {
        label: 'Base color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#0084c4',
        help: 'Color of the first series; others cycle through a palette.',
      },
      {
        label: 'Show legend',
        type: 'boolean',
        target: { kind: 'config', key: 'showLegend' },
      },
    ],
  },
}

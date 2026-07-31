import { functions } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Metric — a self-contained big-number KPI computed from a list of values. */
export const metricWidget: TWidgetDefinition = {
  icon: functions,
  load: () =>
    import('../static/staticWidgets').then((m) => ({
      default: m.StaticMetricPlugin,
    })),
  block: {
    id: 'metric',
    label: 'Metric',
    icon: 'functions',
    category: 'data',
    description: 'A single big-number KPI computed from a list of values.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/static-metric',
    defaultConfig: {
      label: 'Average',
      values: '12, 18, 9, 24, 15',
      aggregation: 'mean',
      decimals: 2,
    },
    hideTitle: true,
    fields: [
      {
        label: 'Label',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Caption shown above the number.',
      },
      {
        label: 'Values',
        type: 'textarea',
        target: { kind: 'config', key: 'values' },
        placeholder: '12, 18, 9, 24, 15',
        help: 'Numbers separated by commas, spaces or new lines. Non-numbers are ignored.',
      },
      {
        label: 'Calculation',
        type: 'select',
        target: { kind: 'config', key: 'aggregation' },
        options: [
          { label: 'Average (mean)', value: 'mean' },
          { label: 'Sum', value: 'sum' },
          { label: 'Minimum', value: 'min' },
          { label: 'Maximum', value: 'max' },
          { label: 'Median', value: 'median' },
          { label: 'Std. deviation', value: 'stddev' },
          { label: 'Count', value: 'count' },
        ],
        help: 'How the values are reduced to a single number.',
      },
      {
        label: 'Unit',
        type: 'text',
        target: { kind: 'config', key: 'unit' },
        placeholder: '%, kg, ms…',
        help: 'Optional unit shown after the number.',
      },
      {
        label: 'Decimals',
        type: 'number',
        target: { kind: 'config', key: 'decimals' },
        help: 'Number of decimal places to display.',
      },
      {
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#243746',
        help: 'Color of the big number (optional).',
      },
      {
        label: 'Alignment',
        type: 'select',
        target: { kind: 'config', key: 'align' },
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
  },
}

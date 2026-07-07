import { remove } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Divider — a self-contained horizontal rule. */
export const dividerWidget: TWidgetDefinition = {
  icon: remove,
  load: () =>
    import('../static/staticWidgets').then((m) => ({
      default: m.StaticDividerPlugin,
    })),
  block: {
    id: 'divider',
    label: 'Divider',
    icon: 'remove',
    category: 'content',
    description: 'A horizontal line to separate sections.',
    contentModel: 'content',
    defaultSize: { columns: 12, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-divider',
    defaultConfig: { color: '#d8d8d8', thickness: 1, spacing: 8 },
    hideTitle: true,
    fields: [
      {
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#d8d8d8',
      },
      {
        label: 'Thickness (px)',
        type: 'number',
        target: { kind: 'config', key: 'thickness' },
      },
      {
        label: 'Spacing (px)',
        type: 'number',
        target: { kind: 'config', key: 'spacing' },
        help: 'Empty space above and below the line.',
      },
    ],
  },
}

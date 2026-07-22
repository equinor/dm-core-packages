import { keyboard_space_bar } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Spacer — self-contained empty vertical whitespace. */
export const spacerWidget: TWidgetDefinition = {
  icon: keyboard_space_bar,
  load: () =>
    import('../static/staticWidgets').then((m) => ({
      default: m.StaticSpacerPlugin,
    })),
  block: {
    id: 'spacer',
    label: 'Spacer',
    icon: 'keyboard_space_bar',
    category: 'content',
    description: 'Empty vertical space between widgets.',
    contentModel: 'content',
    defaultSize: { columns: 12, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-spacer',
    defaultConfig: { height: 24 },
    hideTitle: true,
    fields: [
      {
        label: 'Height (px)',
        type: 'number',
        target: { kind: 'config', key: 'height' },
        help: 'How tall the empty space is.',
      },
    ],
  },
}

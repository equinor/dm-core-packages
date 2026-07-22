import { link } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Button — a self-contained call-to-action link. */
export const buttonWidget: TWidgetDefinition = {
  icon: link,
  load: () =>
    import('../static/staticWidgets').then((m) => ({
      default: m.StaticButtonPlugin,
    })),
  block: {
    id: 'button',
    label: 'Button',
    icon: 'link',
    category: 'content',
    description: 'A call-to-action button that links somewhere.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-button',
    defaultConfig: { label: 'Click me', variant: 'contained', align: 'left' },
    hideTitle: true,
    fields: [
      {
        label: 'Label',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Text shown on the button.',
      },
      {
        label: 'Link (URL)',
        type: 'text',
        target: { kind: 'config', key: 'href' },
        placeholder: 'https://example.com',
        help: 'Where the button navigates when clicked.',
      },
      {
        label: 'Style',
        type: 'select',
        target: { kind: 'config', key: 'variant' },
        options: [
          { label: 'Filled', value: 'contained' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Text only', value: 'ghost' },
        ],
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
      {
        label: 'Open in new tab',
        type: 'boolean',
        target: { kind: 'config', key: 'openInNewTab' },
      },
    ],
  },
}

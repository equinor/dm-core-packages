import { title } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Heading — a self-contained page/section title. */
export const headingWidget: TWidgetDefinition = {
  icon: title,
  load: () =>
    import('../static/staticWidgets').then((m) => ({
      default: m.StaticHeadingPlugin,
    })),
  block: {
    id: 'heading',
    label: 'Heading',
    icon: 'title',
    category: 'content',
    description: 'A page title or section heading.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-heading',
    defaultConfig: { text: 'Heading', level: 2, align: 'left' },
    hideTitle: true,
    fields: [
      {
        label: 'Text',
        type: 'text',
        target: { kind: 'config', key: 'text' },
        help: 'The heading text shown on the page.',
      },
      {
        label: 'Level',
        type: 'select',
        target: { kind: 'config', key: 'level' },
        options: [
          { label: 'H1 — Largest', value: 1 },
          { label: 'H2', value: 2 },
          { label: 'H3', value: 3 },
          { label: 'H4', value: 4 },
          { label: 'H5', value: 5 },
          { label: 'H6 — Smallest', value: 6 },
        ],
        help: 'Heading level controls size and document outline.',
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
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#333 or red',
        help: 'Text color (optional).',
      },
    ],
  },
}

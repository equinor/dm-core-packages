import { text_field } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Text — markdown content. Reuses the runtime `markdown` plugin, so it has no
 * component of its own.
 */
export const textWidget: TWidgetDefinition = {
  icon: text_field,
  block: {
    id: 'text',
    label: 'Text',
    icon: 'text_field',
    category: 'content',
    description: 'Markdown rendered from a bound document.',
    contentModel: 'content',
    defaultSize: { columns: 6, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/markdown',
    defaultConfig: { content: 'Write your text here.' },
    fields: [
      {
        label: 'Content',
        type: 'textarea',
        target: { kind: 'config', key: 'content' },
        help: 'Markdown text shown in this widget. Bind a Scope instead to use a document.',
      },
    ],
  },
}

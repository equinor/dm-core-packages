import { play_circle } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/** Video / Embed — a self-contained iframe for YouTube/Vimeo/any URL. */
export const embedWidget: TWidgetDefinition = {
  icon: play_circle,
  load: () =>
    import('../staticWidgets').then((m) => ({ default: m.StaticEmbedPlugin })),
  block: {
    id: 'embed',
    label: 'Video / Embed',
    icon: 'play_circle',
    category: 'media',
    description: 'Embed a YouTube/Vimeo video or any external page.',
    contentModel: 'content',
    defaultSize: { columns: 6, rows: 5 },
    recipe: '@development-framework/dm-core-plugins/static-embed',
    defaultConfig: {},
    hideTitle: true,
    fields: [
      {
        label: 'URL',
        type: 'text',
        target: { kind: 'config', key: 'url' },
        placeholder: 'https://www.youtube.com/watch?v=…',
        help: 'YouTube and Vimeo share links are converted automatically.',
      },
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
        help: 'Accessible title for the embedded frame.',
      },
    ],
  },
}

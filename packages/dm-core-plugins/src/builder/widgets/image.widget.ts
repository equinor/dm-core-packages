import { image } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Image — media from a bound/uploaded file. Reuses the runtime `media-viewer`
 * plugin, so it has no component of its own.
 */
export const imageWidget: TWidgetDefinition = {
  icon: image,
  block: {
    id: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media',
    description: 'An image or other media asset from a bound file.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/media-viewer',
    defaultConfig: { fill: 'width' },
    fields: [
      {
        label: 'Image',
        type: 'image-upload',
        target: { kind: 'config', key: 'address' },
        help: 'Browse your computer to upload an image, or bind a Scope to a file.',
      },
      {
        label: 'Caption',
        type: 'text',
        target: { kind: 'config', key: 'caption' },
        help: 'Text shown beneath the image.',
      },
      {
        label: 'Width (px)',
        type: 'number',
        target: { kind: 'config', key: 'width' },
        help: 'Fixed width in pixels (optional).',
      },
      {
        label: 'Height (px)',
        type: 'number',
        target: { kind: 'config', key: 'height' },
        help: 'Fixed height in pixels (optional).',
      },
    ],
  },
}

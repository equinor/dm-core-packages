import type { TBlock } from './types'

/**
 * The v1 widget catalogue shown in the palette.
 *
 * - `content` blocks (Text, Image) render document-backed content and bind to a
 *   DMSS attribute via `scope` (e.g. a markdown blob or a media file).
 * - `data` blocks (Table, Form) bind to an existing DMSS entity via `scope`.
 * - `layout` blocks (Section) are containers (a nested grid).
 *
 * `defaultConfig` seeds a valid recipe config so a freshly dropped widget
 * renders in preview without manual setup. `fields` are block-specific
 * properties surfaced in the inspector; they target config keys the runtime
 * plugin actually consumes.
 */
export const BLOCKS: TBlock[] = [
  {
    id: 'section',
    label: 'Section',
    icon: 'view_module',
    category: 'layout',
    description: 'A container to group and arrange other widgets.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/grid',
    defaultConfig: {
      size: { columns: 6, rows: 4, rowGap: '16px', columnGap: '16px' },
      items: [],
      itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
      showItemBorders: false,
    },
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'text_field',
    category: 'content',
    description: 'Markdown rendered from a bound document.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 1 },
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
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media',
    description: 'An image or other media asset from a bound file.',
    contentModel: 'content',
    defaultSize: { columns: 2, rows: 2 },
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
  {
    id: 'table',
    label: 'Table',
    icon: 'table_chart',
    category: 'data',
    description: 'A table from an uploaded CSV or Excel file.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/markdown',
    defaultConfig: {
      content:
        '| Column A | Column B |\n| --- | --- |\n| Row 1 | Value |\n| Row 2 | Value |',
    },
    fields: [
      {
        label: 'Data',
        type: 'table-upload',
        target: { kind: 'config', key: 'content' },
        help: 'Upload a CSV or Excel file to fill the table. Edit cells below.',
      },
      {
        label: 'Table (markdown)',
        type: 'textarea',
        target: { kind: 'config', key: 'content' },
        help: 'The table as markdown. Uploading a file replaces this.',
      },
    ],
  },
  {
    id: 'form',
    label: 'Form',
    icon: 'list',
    category: 'data',
    description: 'An editable form bound to an entity.',
    contentModel: 'data',
    defaultSize: { columns: 3, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/form',
  },
]

export const getBlock = (id: string): TBlock | undefined =>
  BLOCKS.find((block) => block.id === id)

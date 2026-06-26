import type { TBlock } from './types'

/**
 * The v1 widget catalogue shown in the palette.
 *
 * - `content` blocks (Text, Image) carry their own content inline.
 * - `data` blocks (Table, Form) bind to an existing DMSS entity.
 * - `layout` blocks (Section) are containers (a nested grid).
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
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'text_field',
    category: 'content',
    description: 'Rich text written in Markdown.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/markdown',
  },
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media',
    description: 'An image or other media asset.',
    contentModel: 'content',
    defaultSize: { columns: 2, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/media-viewer',
  },
  {
    id: 'table',
    label: 'Table',
    icon: 'table_chart',
    category: 'data',
    description: 'A table bound to a list of entities.',
    contentModel: 'data',
    defaultSize: { columns: 4, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/table',
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

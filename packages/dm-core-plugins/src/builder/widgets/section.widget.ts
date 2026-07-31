import { view_module } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Section — a container widget. Reuses the runtime `grid` plugin, so it has no
 * component of its own: dropping it creates a nested grid you can drill into.
 */
export const sectionWidget: TWidgetDefinition = {
  icon: view_module,
  block: {
    id: 'section',
    label: 'Section',
    icon: 'view_module',
    category: 'layout',
    description: 'A container to group and arrange other widgets.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/grid',
    defaultConfig: {
      size: { columns: 12, rows: 8, rowGap: '8px', columnGap: '8px' },
      items: [],
      itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
      showItemBorders: false,
    },
  },
}

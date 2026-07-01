import { list } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Form — an editable form bound to a DMSS entity. Reuses the runtime `form`
 * plugin, so it has no component of its own.
 */
export const formWidget: TWidgetDefinition = {
  icon: list,
  block: {
    id: 'form',
    label: 'Form',
    icon: 'list',
    category: 'data',
    description: 'An editable form bound to an entity.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/form',
  },
}

import { category } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Blueprint hierarchy — a diagram of a bound blueprint and its relations.
 * Reuses the runtime `blueprint-hierarchy` plugin, so it has no component of
 * its own.
 */
export const blueprintHierarchyWidget: TWidgetDefinition = {
  icon: category,
  block: {
    id: 'blueprint-hierarchy',
    label: 'Blueprint hierarchy',
    icon: 'category',
    category: 'data',
    description: 'A diagram of a blueprint and its relations.',
    contentModel: 'data',
    defaultSize: { columns: 8, rows: 5 },
    recipe: '@development-framework/dm-core-plugins/blueprint-hierarchy',
  },
}

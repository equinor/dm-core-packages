import { file_description } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Single view — renders a bound entity with its default (or a named) view.
 * Reuses the runtime `single_view` plugin, so it has no component of its own.
 */
export const singleViewWidget: TWidgetDefinition = {
  icon: file_description,
  block: {
    id: 'single-view',
    label: 'Single view',
    icon: 'file_description',
    category: 'data',
    description: 'Render one entity with its default view.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/single_view',
    defaultConfig: {
      type: 'CORE:ViewConfig',
    },
  },
}

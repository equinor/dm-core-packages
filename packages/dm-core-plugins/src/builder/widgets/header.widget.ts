import { assignment } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Header — an application header with recipe navigation and user info. Reuses
 * the runtime `header` plugin, so it has no component of its own.
 */
export const headerWidget: TWidgetDefinition = {
  icon: assignment,
  block: {
    id: 'app-header',
    label: 'Header',
    icon: 'assignment',
    category: 'layout',
    description: 'An application header with navigation and user info.',
    contentModel: 'data',
    defaultSize: { columns: 12, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/header',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/header/HeaderPluginConfig',
      uiRecipesList: [],
      hideAbout: false,
      hideUserInfo: false,
    },
    fields: [
      {
        label: 'Hide about',
        type: 'boolean',
        target: { kind: 'config', key: 'hideAbout' },
      },
      {
        label: 'Hide user info',
        type: 'boolean',
        target: { kind: 'config', key: 'hideUserInfo' },
      },
    ],
  },
}

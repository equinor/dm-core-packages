import { play } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Job — run and monitor a bound Job entity. Reuses the runtime `job` plugin, so
 * it has no component of its own.
 */
export const jobWidget: TWidgetDefinition = {
  icon: play,
  block: {
    id: 'job',
    label: 'Job',
    icon: 'play',
    category: 'data',
    description:
      'Run and monitor a job — start it, schedule it, and read logs.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/job',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/job/ControlConfig',
      hideLogs: false,
    },
    fields: [
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
        help: 'Heading shown above the job controls.',
      },
      {
        label: 'Hide logs',
        type: 'boolean',
        target: { kind: 'config', key: 'hideLogs' },
        help: 'Hide the streamed job log output.',
      },
    ],
  },
}

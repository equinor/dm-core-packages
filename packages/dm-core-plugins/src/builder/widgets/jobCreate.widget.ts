import { add_circle_filled } from '@equinor/eds-icons'
import type { TWidgetDefinition } from './types'

/**
 * Create job — start a job from a template against a bound target. Reuses the
 * runtime `job/create` plugin, so it has no component of its own.
 */
export const jobCreateWidget: TWidgetDefinition = {
  icon: add_circle_filled,
  block: {
    id: 'job-create',
    label: 'Create job',
    icon: 'add_circle_filled',
    category: 'data',
    description: 'Start a job from a template against a bound target.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/job/create',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/job/CreateConfig',
      jobTargetAddress: './job',
      jobTemplates: [],
      recurring: false,
      hideLogs: false,
    },
    fields: [
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
      },
      {
        label: 'Job target address',
        type: 'text',
        target: { kind: 'config', key: 'jobTargetAddress' },
        help: 'Address the created job is written to (e.g. ./job).',
      },
      {
        label: 'Recurring',
        type: 'boolean',
        target: { kind: 'config', key: 'recurring' },
        help: 'Allow the job to be scheduled on a recurring basis.',
      },
      {
        label: 'Hide logs',
        type: 'boolean',
        target: { kind: 'config', key: 'hideLogs' },
      },
    ],
  },
}

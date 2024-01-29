import {
  EBlueprint,
  JobStatus,
  TJob,
  TRecurringJob,
  TSchedule,
} from '@development-framework/dm-core'
import { DateTime } from 'luxon'

export const scheduleTemplate = (): TSchedule => ({
  type: EBlueprint.CRON_JOB,
  cron: '0 8 * * *',
  startDate: DateTime.now().startOf('day').toISO() || '',
  endDate: DateTime.now().startOf('day').plus({ year: 1 }).toISO() || '',
  runs: [],
})

export function getRecurringJobTemplate(
  job: TJob,
  schedule: TSchedule,
  username: string = 'Anonymous',
  label: string = 'Recurring job'
): TRecurringJob {
  return {
    type: EBlueprint.RECURRING_JOB,
    label: label,
    status: JobStatus.NotStarted,
    triggeredBy: username,
    applicationInput: job,
    runner: {
      type: EBlueprint.RECURRING_JOB_HANDLER,
    },
    schedule: { ...schedule, runs: [] },
  }
}

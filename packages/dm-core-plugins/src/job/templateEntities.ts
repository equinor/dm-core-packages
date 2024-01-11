import {
  EBlueprint,
  JobStatus,
  TJob,
  TRecurringJob,
  TSchedule,
} from '@development-framework/dm-core'

export const scheduleTemplate = (): TSchedule => ({
  type: EBlueprint.CRON_JOB,
  cron: '0 8 * * *',
  startDate: new Date().toISOString().slice(0, 16),
  endDate: new Date().toISOString().slice(0, 16),
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

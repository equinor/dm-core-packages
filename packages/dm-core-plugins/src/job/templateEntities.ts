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
export const getJobTemplate = ({
  config,
  username,
  idReference,
}: any): TJob => {
  let jobInputAddress: string = idReference + config.jobInput.targetAddress

  if ((config.jobInput.addressScope ?? 'local') !== 'local') {
    jobInputAddress = config.jobInput.targetAddress
  } else if (['self', '.'].includes(config.jobInput.targetAddress)) {
    jobInputAddress = idReference
  }

  const jobEntity: TJob = {
    type: EBlueprint.JOB,
    label: config?.label,
    status: JobStatus.NotStarted,
    triggeredBy: username,
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: jobInputAddress,
    },
    runner: config?.runner,
  }

  if (config?.outputTarget) jobEntity.outputTarget = config.outputTarget
  return jobEntity
}

export const getRecurringJobTemplate = ({
  config,
  username,
  idReference,
  schedule,
}: any): TRecurringJob => {
  return {
    type: EBlueprint.RECURRING_JOB,
    label: config?.label,
    status: JobStatus.NotStarted,
    triggeredBy: username,
    applicationInput: getJobTemplate({ config, username, idReference }),
    runner: {
      type: EBlueprint.RECURRING_JOB_HANDLER,
    },
    schedule: schedule,
  }
}

export const getNewJobDocument = ({
  config,
  username,
  idReference,
  asCronJob,
  schedule,
}: any): TJob | TRecurringJob => {
  if (asCronJob)
    return getRecurringJobTemplate({ config, username, idReference, schedule })
  return getJobTemplate({ config, username, idReference })
}

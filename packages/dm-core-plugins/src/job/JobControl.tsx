import {
  DeleteJobResponse,
  EBlueprint,
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  TRecurringJob,
  TSchedule,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import React, { useEffect, useState } from 'react'
import { Chip } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { scheduleTemplate } from './templateEntities'
import { ConfigureRecurring, getVariant, JobLog, Progress } from './common'
import {
  CompletedButton,
  LoadingButton,
  RerunButton,
  StartButton,
} from './SimpleJobControlButtons'

const JobButtonWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
`
const getControlButton = (
  status: JobStatus,
  remove: () => Promise<DeleteJobResponse | null>,
  start: () => void,
  asCronJob: boolean = false
) => {
  switch (status) {
    case JobStatus.Unknown:
      return (
        <StartButton jobStatus={status} start={start} asCronJob={asCronJob} />
      )
    case JobStatus.Completed:
      return (
        <CompletedButton jobStatus={status} remove={remove} start={start} />
      )
    case JobStatus.Failed:
      return <RerunButton jobStatus={status} remove={remove} start={start} />
    case JobStatus.Running:
    case JobStatus.Starting:
    case JobStatus.Registered:
      return <LoadingButton jobStatus={status} remove={remove} />
    default:
      return (
        <StartButton jobStatus={status} start={start} asCronJob={asCronJob} />
      )
  }
}

export const JobControl = (props: IUIPlugin) => {
  const { idReference } = props
  const {
    document: jobEntity,
    isLoading,
    error: jobEntityError,
  } = useDocument<TJob | TRecurringJob>(idReference, 0, false)

  const [asCronJob, setAsCronJob] = useState<boolean>(false)
  const [schedule, setSchedule] = useState<TSchedule>(scheduleTemplate())

  const { start, error, logs, progress, status, remove } = useJob(
    idReference,
    jobEntity?.uid
  )

  useEffect(() => {
    if (!jobEntity) return
    if (asCronJob || jobEntity.type === EBlueprint.RECURRING_JOB)
      setSchedule((jobEntity as TRecurringJob)?.schedule)
    if (jobEntity.type === EBlueprint.RECURRING_JOB) setAsCronJob(true)
  }, [isLoading, jobEntityError, jobEntity])

  if (isLoading) return <Loading />

  if (error || jobEntityError)
    throw new Error(JSON.stringify(error || jobEntityError, null, 2))

  return (
    <div>
      <ConfigureRecurring
        asCron={asCronJob}
        setAsCron={setAsCronJob}
        readOnly={true}
        schedule={schedule}
        registered={jobEntity?.status !== JobStatus.NotStarted}
      />
      <JobButtonWrapper>
        {getControlButton(status, remove, start, false)}
        <JobLog logs={logs} error={error} />
        <Chip variant={getVariant(status)}>{status ?? 'Not registered'}</Chip>
      </JobButtonWrapper>
      {status === JobStatus.Running && progress !== null && (
        <Progress progress={progress} />
      )}
    </div>
  )
}

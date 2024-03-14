import {
  DeleteJobResponse,
  ErrorResponse,
  JobStatus,
  TSchedule,
} from '@development-framework/dm-core'
import { Button, Icon, LinearProgress, Switch } from '@equinor/eds-core-react'
import { expand_screen } from '@equinor/eds-icons'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ConfigureSchedule } from './CronJob'
import { JobLogsDialog } from './JobLogsDialog'
import {
  CompletedButton,
  ErrorButton,
  LoadingButton,
  RerunButton,
  StartButton,
} from './SimpleJobControlButtons'

export const getVariant = (status: JobStatus) => {
  switch (status) {
    case JobStatus.Failed:
      return 'error'
    case JobStatus.Completed:
      return 'active'
    default:
      return 'default'
  }
}

export enum EInterval {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}
export type TCronValues = {
  interval: EInterval
  hour: string
  hourStep: string
  minute: string
}

export const parseCronValuesToCronString = (
  cronValues: TCronValues
): string => {
  const newMinute = cronValues.minute
  let newHour = cronValues.hour
  let dayOfMonth = '*'
  const month = '*'
  let dayOfWeek = '*'

  switch (cronValues.interval) {
    case EInterval.WEEKLY:
      dayOfMonth = '*'
      dayOfWeek = '6'
      break
    case EInterval.MONTHLY:
      dayOfMonth = '1'
      break
    case EInterval.HOURLY:
      newHour = cronValues.hourStep ? `*/${cronValues.hourStep}` : '*'
      break
    case EInterval.DAILY:
      newHour = cronValues.hour.split('/')[1]
      if (!newHour) newHour = cronValues.hour
      break
  }
  return `${newMinute} ${newHour} ${dayOfMonth} ${month} ${dayOfWeek}`
}

export const parseCronStringToCronValues = (
  cronString: string
): TCronValues => {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(' ')
  const newHour = hour
  let newHourStep = '1'
  let newInterval = EInterval.DAILY

  if (dayOfMonth !== '*') newInterval = EInterval.MONTHLY
  if (dayOfWeek !== '*') newInterval = EInterval.WEEKLY
  if (hour.includes('/')) newInterval = EInterval.HOURLY

  if (newInterval === EInterval.HOURLY) newHourStep = hour.split('/')[1]

  return {
    minute: minute,
    hour: newHour,
    interval: newInterval,
    hourStep: newHourStep,
  }
}

export const JobLog = (props: {
  logs: string[]
  error: ErrorResponse | undefined
}) => {
  const [showLogs, setShowLogs] = useState(false)
  return (
    <>
      <Button onClick={() => setShowLogs(!showLogs)} variant='ghost'>
        {showLogs ? 'Hide' : 'Show'} logs
        <Icon data={expand_screen} size={16} />
      </Button>
      <JobLogsDialog
        isOpen={showLogs}
        setIsOpen={setShowLogs}
        logs={props.logs}
        error={props.error}
        result={null}
      />
    </>
  )
}
export const JobButtonWrapper = styled.div`
  display: flex;
  padding-top: 0.5rem;
  flex-direction: row;
  align-items: center;
  text-align: center;
  padding-inline: 0.5rem; 
  margin-bottom: 0.5rem;
  justify-content: space-between;
  min-width: max-content;
`
export const getControlButton = (
  status: JobStatus,
  remove: () => Promise<DeleteJobResponse | null>,
  start: () => void,
  asCronJob: boolean = false,
  isLoading: boolean = false,
  error: ErrorResponse | undefined = undefined
) => {
  // return <LoadingButton jobStatus={status} remove={remove} />
  if (isLoading) return <LoadingButton jobStatus={status} remove={remove} />
  if (error) return <ErrorButton error={error} />

  switch (status) {
    case JobStatus.Completed:
      return (
        <CompletedButton jobStatus={status} remove={remove} start={start} />
      )
    case JobStatus.Failed:
      return <RerunButton jobStatus={status} remove={remove} start={start} />
    case JobStatus.Unknown:
    case JobStatus.Running:
    case JobStatus.Starting:
    case JobStatus.Registered:
      return <LoadingButton jobStatus={status} remove={remove} />
    case JobStatus.NotStarted:
      return (
        <StartButton jobStatus={status} start={start} asCronJob={asCronJob} />
      )
    default:
      return (
        <StartButton jobStatus={status} start={start} asCronJob={asCronJob} />
      )
  }
}

export const Progress = (props: { progress: number }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <LinearProgress
        aria-label='Progress bar label'
        value={Math.round(props.progress * 100)}
        variant='determinate'
        style={{
          marginRight: '10px',
        }}
      />
      {Math.round(props.progress * 100)}%
    </div>
  )
}

export const ConfigureRecurring = (props: {
  asCron: boolean
  setAsCron?: (v: boolean) => void
  cronValues: TCronValues
  setCronValues?: (s: TCronValues) => void
  schedule: TSchedule
  setSchedule?: (s: TSchedule) => void
  registered: boolean
  readOnly?: boolean
}) => {
  return (
    <>
      {props.setAsCron && (
        <Switch
          size='small'
          label='Recurring'
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (props.setAsCron) props.setAsCron(e.target.checked)
          }}
          checked={props.asCron}
        />
      )}
      {props.asCron && (
        <ConfigureSchedule
          schedule={props.schedule}
          setSchedule={props.setSchedule || (() => null)}
          cronValues={props.cronValues}
          setCronValues={props.setCronValues || (() => null)}
          isRegistered={props.registered}
          readOnly={props.readOnly || false}
        />
      )}
    </>
  )
}

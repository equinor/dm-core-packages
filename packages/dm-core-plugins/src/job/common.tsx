import {
  DeleteJobResponse,
  ErrorResponse,
  JobStatus,
  TSchedule,
} from '@development-framework/dm-core'
import { JobLogsDialog } from './JobLogsDialog'
import React, { ChangeEvent, useState } from 'react'
import { Button, Icon, LinearProgress, Switch } from '@equinor/eds-core-react'
import { expand_screen } from '@equinor/eds-icons'
import { ConfigureSchedule } from './CronJob'
import {
  CompletedButton,
  LoadingButton,
  RerunButton,
  StartButton,
} from './SimpleJobControlButtons'
import styled from 'styled-components'

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
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
`
export const getControlButton = (
  status: JobStatus,
  remove: () => Promise<DeleteJobResponse | null>,
  start: () => void,
  asCronJob: boolean = false,
  isLoading: boolean = false
) => {
  // return <LoadingButton jobStatus={status} remove={remove} />
  if (isLoading) return <LoadingButton jobStatus={status} remove={remove} />
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
        width: '50%',
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
  setAsCron: (v: boolean) => void
  schedule: TSchedule
  setSchedule?: (s: TSchedule) => void
  registered: boolean
  readOnly?: boolean
}) => {
  return (
    <>
      <Switch
        size='small'
        label='Recurring'
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (props.setAsCron) props.setAsCron(e.target.checked)
        }}
        checked={props.asCron}
      />
      {props.asCron && (
        <ConfigureSchedule
          schedule={props.schedule}
          // @ts-ignore
          setSchedule={props.setSchedule || (() => null)}
          isRegistered={props.registered}
          readOnly={props.readOnly || false}
        />
      )}
    </>
  )
}

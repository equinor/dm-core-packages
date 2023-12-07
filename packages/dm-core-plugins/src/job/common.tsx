import {
  ErrorResponse,
  JobStatus,
  TSchedule,
} from '@development-framework/dm-core'
import { JobLogsDialog } from './JobLogsDialog'
import React, { ChangeEvent, useState } from 'react'
import { Button, Icon, LinearProgress, Switch } from '@equinor/eds-core-react'
import { expand_screen } from '@equinor/eds-icons'
import { ConfigureSchedule } from './CronJob'

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
        <Icon data={expand_screen} />
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

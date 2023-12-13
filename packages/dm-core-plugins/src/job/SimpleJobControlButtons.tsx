import {
  Button,
  CircularProgress,
  Icon,
  Tooltip,
} from '@equinor/eds-core-react'
import { check, play, refresh, stop } from '@equinor/eds-icons'
import { DeleteJobResponse, JobStatus } from '@development-framework/dm-core'
import React, { useState } from 'react'
import { RemoveJobDialog } from './RemoveJobDialog'

export const StartButton = (props: {
  jobStatus: JobStatus
  start: () => void
  asCronJob: boolean
}) => {
  const { start } = props

  return (
    <Button variant='contained_icon' aria-label='Run' onClick={() => start()}>
      <Icon data={play} />
    </Button>
  )
}

export const LoadingButton = (props: {
  jobStatus: JobStatus
  remove: () => void
}) => {
  const { remove, jobStatus } = props
  const [isHovering, setIsHovering] = useState<boolean>(false)

  return (
    <Button
      variant='contained_icon'
      aria-label='Remove'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => remove()}
    >
      {!isHovering && jobStatus !== JobStatus.Registered ? (
        <CircularProgress size={24} variant='indeterminate' color='neutral' />
      ) : (
        <Icon data={stop} />
      )}
    </Button>
  )
}

export const RerunButton = (props: {
  jobStatus: JobStatus
  remove: () => Promise<DeleteJobResponse | null>
  start: () => void
}) => {
  const [showRestartDialog, setShowRestartDialog] = useState<boolean>(false)
  return (
    <Tooltip title={'Rerun job'}>
      <>
        <Button
          variant='contained_icon'
          color={'danger'}
          aria-label='Rerun'
          onClick={() => setShowRestartDialog(true)}
        >
          <Icon data={refresh} />
        </Button>
        <RemoveJobDialog
          isOpen={showRestartDialog}
          title={'Remove old job and rerun?'}
          onConfirm={async () => {
            await props.remove()
            props.start()
          }}
          close={() => setShowRestartDialog(false)}
        />
      </>
    </Tooltip>
  )
}
export const CompletedButton = (props: {
  jobStatus: JobStatus
  remove: () => Promise<DeleteJobResponse | null>
  start: () => void
}) => {
  const { jobStatus, remove, start } = props

  const [isHovering, setIsHovering] = useState<boolean>(false)
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <RerunButton jobStatus={jobStatus} remove={remove} start={start} />
      ) : (
        <div
          style={{
            height: '40px',
            width: '40px',
            borderRadius: '50%',
            display: 'flex',
            backgroundColor: 'green',
            justifyItems: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon data={check} style={{ color: 'white' }} />
        </div>
      )}
    </div>
  )
}

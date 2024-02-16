import {
  DeleteJobResponse,
  ErrorResponse,
  JobStatus,
} from '@development-framework/dm-core'
import {
  Button,
  CircularProgress,
  Icon,
  Tooltip,
} from '@equinor/eds-core-react'
import {
  check,
  error_outlined,
  play_circle,
  refresh,
  stop,
} from '@equinor/eds-icons'
import { useState } from 'react'
import { RemoveJobDialog } from './RemoveJobDialog'

const loadingColor = '#eb9131'

export const StartButton = (props: {
  jobStatus: JobStatus
  start: () => void
  asCronJob: boolean
}) => {
  const { start } = props

  return (
    <Icon
      data={play_circle}
      color='rgb(21 128 61)'
      size={48}
      aria-label='Run'
      onClick={() => start()}
      className='cursor-pointer hover:opacity-60'
    ></Icon>
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
      style={{
        backgroundColor: `${
          isHovering || jobStatus === JobStatus.Registered
            ? 'red'
            : loadingColor
        }`,
      }}
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
          style={{
            backgroundColor: loadingColor,
          }}
          aria-label='Rerun'
          onClick={() => setShowRestartDialog(true)}
        >
          <Icon data={refresh} />
        </Button>
        <RemoveJobDialog
          isOpen={showRestartDialog}
          title={'Remove previous job and rerun?'}
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
        <Button
          variant='contained_icon'
          style={{
            backgroundColor: 'green',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Icon data={check} style={{ color: 'white' }} />
        </Button>
      )}
    </div>
  )
}

export const ErrorButton = (props: { error: ErrorResponse }) => {
  return (
    <Button
      style={{
        backgroundColor: loadingColor,
        cursor: 'not-allowed',
      }}
      variant='contained_icon'
    >
      <Icon data={error_outlined} style={{ color: 'white' }} />
    </Button>
  )
}

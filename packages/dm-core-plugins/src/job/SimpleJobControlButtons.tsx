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
import { tokens } from '@equinor/eds-tokens'
import { useState } from 'react'
import { RemoveJobDialog } from './RemoveJobDialog'

const colors = {
  loading: '#eb9131',
  run: tokens.colors.interactive.success__resting.rgba,
  error: tokens.colors.interactive.danger__resting.rgba,
}

export const StartButton = (props: {
  jobStatus: JobStatus
  start: () => void
  asCronJob: boolean
}) => {
  const { start } = props

  return (
    <Icon
      data={play_circle}
      color={tokens.colors.interactive.success__resting.rgba}
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
            ? colors.error
            : colors.loading
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
            backgroundColor: colors.loading,
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
            backgroundColor: colors.run,
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
        backgroundColor: colors.error,
        cursor: 'not-allowed',
      }}
      variant='contained_icon'
    >
      <Icon data={error_outlined} style={{ color: 'white' }} />
    </Button>
  )
}

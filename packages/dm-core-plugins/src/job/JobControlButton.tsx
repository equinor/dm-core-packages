import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { play, stop, refresh } from '@equinor/eds-icons'
import { JobStatus } from '@development-framework/dm-core'
import React, { MutableRefObject, useRef, useState } from 'react'

export const JobControlButton = (props: {
  jobStatus: JobStatus
  createJob: () => void
  remove: () => void
  asCronJob: boolean
  disabled: boolean
  exists: boolean
}) => {
  const { jobStatus, createJob, asCronJob, disabled, exists, remove } = props
  const [hovering, setHovering] = useState(false)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  const buttonText = () => {
    switch (jobStatus) {
      case JobStatus.Running:
        return hovering ? 'Stop' : 'Running'
      case JobStatus.Failed:
      case JobStatus.Completed:
        return 'Re-run'
      case JobStatus.Registered:
        return 'Remove'
      default:
        return asCronJob ? 'Schedule' : 'Run'
    }
  }

  const buttonIcon = () => {
    switch (jobStatus) {
      case JobStatus.Removed:
      case JobStatus.Failed:
        return <Icon data={refresh} />
      case JobStatus.Running:
      case JobStatus.Registered:
        return <Icon data={stop} />
      case JobStatus.NotStarted:
        return <Icon data={play} />
      default:
        return <Icon data={play} />
    }
  }

  return (
    <Button
      ref={buttonRef}
      onClick={() => {
        if (exists) {
          remove()
        }
        createJob()
      }}
      style={{ width: '7rem' }}
      disabled={disabled}
    >
      {jobStatus === JobStatus.Running && !hovering ? (
        <CircularProgress size={16} variant="indeterminate" />
      ) : (
        buttonIcon()
      )}
      {buttonText()}
    </Button>
  )
}

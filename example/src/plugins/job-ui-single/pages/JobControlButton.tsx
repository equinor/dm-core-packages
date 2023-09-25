import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { play, stop } from '@equinor/eds-icons'
import { JobStatus, StartJobResponse } from '@development-framework/dm-core'
import React, { MutableRefObject, useRef, useState } from 'react'

export const JobControlButton = (props: {
  jobStatus: JobStatus
  jobExists?: boolean
  createJob?: () => Promise<unknown>
  start: () => Promise<StartJobResponse | null>
  halt: () => void
}) => {
  const { jobStatus, start, halt, jobExists, createJob } = props
  const [hovering, setHovering] = useState(false)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  function handleClick(): void {
    if (jobStatus === JobStatus.Running) halt()
    else {
      if (!jobExists && createJob) {
        createJob().then(() => {
          start()
        })
      } else {
        start()
      }
    }
  }

  const buttonText = () => {
    switch (jobStatus) {
      case 'completed':
        return 'Re-run'
      case 'running':
        return hovering ? 'Stop' : 'Running'
      default:
        return 'Start'
    }
  }

  return (
    <Button ref={buttonRef} onClick={handleClick} style={{ width: '7rem' }}>
      {jobStatus === JobStatus.Running && !hovering ? (
        <CircularProgress size={16} variant="indeterminate" />
      ) : (
        <Icon
          data={hovering && jobStatus === JobStatus.Running ? stop : play}
        />
      )}
      {buttonText()}
    </Button>
  )
}

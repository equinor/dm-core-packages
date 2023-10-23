import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { play, stop, refresh } from '@equinor/eds-icons'
import { JobStatus } from '@development-framework/dm-core'
import React, { MutableRefObject, useRef, useState } from 'react'

export const JobControlButton = (props: {
  jobStatus: JobStatus
  jobExists: boolean
  createJob: () => Promise<unknown>
  start: () => void
}) => {
  const { jobStatus, start, jobExists, createJob } = props
  const [hovering, setHovering] = useState(false)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  function handleClick() {
    if (!jobExists) return createJob().then(() => start())
    start()
  }

  const buttonText = () => {
    switch (jobStatus) {
      case 'running':
        return hovering ? 'Stop' : 'Running'
      case 'completed':
        return 'Re-run'
      case 'failed':
        return 'Re-run'
      default:
        return 'Start'
    }
  }

  const buttonIcon = () => {
    switch (jobStatus) {
      case JobStatus.Failed:
        return <Icon data={refresh} />
      case JobStatus.Running:
        return <Icon data={stop} />
      case JobStatus.Removed || JobStatus.NotStarted:
        return <Icon data={play} />
      default:
        return <Icon data={play} />
    }
  }

  return (
    <Button ref={buttonRef} onClick={handleClick} style={{ width: '7rem' }}>
      {jobStatus === JobStatus.Running && !hovering ? (
        <CircularProgress size={16} variant="indeterminate" />
      ) : (
        buttonIcon()
      )}
      {buttonText()}
    </Button>
  )
}

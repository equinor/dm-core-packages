import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { play, stop } from '@equinor/eds-icons'
import { JobStatus, StartJobResponse } from '@development-framework/dm-core'
import React, { MutableRefObject, useRef, useState } from 'react'

export const JobControlButton = (props: {
  jobStatus: JobStatus
  isRunning: boolean
  start: () => Promise<StartJobResponse | null>
  halt: () => void
}) => {
  const [hovering, setHovering] = useState(false)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  function handleClick(): void {
    if (props.jobStatus === JobStatus.Running) props.halt()
    else {
      props.start()
    }
  }

  return (
    <Button ref={buttonRef} onClick={handleClick}>
      {props.isRunning ? (
        <CircularProgress size={16} variant="indeterminate" />
      ) : (
        <Icon data={props.jobStatus === JobStatus.Running ? stop : play} />
      )}
      {props.isRunning ? (hovering ? 'Stop' : 'Running') : 'Start'}
      {/*<Icon data={play}/> Start*/}
    </Button>
  )
}

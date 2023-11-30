import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { play, stop, refresh, IconData, calendar } from '@equinor/eds-icons'
import { JobStatus } from '@development-framework/dm-core'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

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
  const [buttonColor, setButtonColor] = useState<
    'primary' | 'secondary' | 'danger'
  >('primary')
  const [buttonIcon, setButtonIcon] = useState<IconData>(play)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  useEffect(() => {
    switch (jobStatus) {
      case JobStatus.Completed:
      case JobStatus.Failed:
        setButtonColor('primary')
        setButtonIcon(asCronJob ? calendar : refresh)
        break
      case JobStatus.Running:
      case JobStatus.Starting:
      case JobStatus.Registered:
        setButtonColor('danger')
        setButtonIcon(stop)
        break
      default:
        setButtonColor('primary')
        setButtonIcon(asCronJob ? calendar : play)
    }
  }, [jobStatus, asCronJob])

  return (
    <Button
      variant='contained_icon'
      aria-label='Run'
      ref={buttonRef}
      color={buttonColor}
      onClick={() => {
        if (
          (
            [
              JobStatus.Running,
              JobStatus.Starting,
              JobStatus.Registered,
            ] as JobStatus[]
          ).includes(jobStatus) &&
          exists
        ) {
          remove()
        } else if (
          ([JobStatus.Completed, JobStatus.Failed] as JobStatus[]).includes(
            jobStatus
          ) &&
          exists
        ) {
          remove()
          createJob()
        } else {
          createJob()
        }
      }}
      disabled={disabled}
    >
      {jobStatus === JobStatus.Running && !hovering ? (
        <CircularProgress size={16} variant='indeterminate' />
      ) : (
        <Icon data={buttonIcon} />
      )}
    </Button>
  )
}

import { Button, CircularProgress, Icon } from '@equinor/eds-core-react'
import { IconData, play, refresh, save, stop } from '@equinor/eds-icons'
import { JobStatus } from '@development-framework/dm-core'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

export const JobControlButton = (props: {
  jobStatus: JobStatus
  createJob: () => void
  remove: () => void
  confirmRemove: () => void
  asCronJob: boolean
  exists: boolean
}) => {
  const { jobStatus, createJob, asCronJob, exists, remove, confirmRemove } =
    props
  const [hovering, setHovering] = useState(false)
  const [buttonColor, setButtonColor] = useState<
    'primary' | 'secondary' | 'danger'
  >('primary')
  const [buttonIcon, setButtonIcon] = useState<IconData>(play)
  const [recentlyClicked, setRecentlyClicked] = useState<boolean>(false)
  const buttonRef: MutableRefObject<HTMLButtonElement | undefined> = useRef()
  buttonRef.current?.addEventListener('mouseenter', () => setHovering(true))
  buttonRef.current?.addEventListener('mouseleave', () => setHovering(false))

  useEffect(() => {
    switch (jobStatus) {
      case JobStatus.Unknown:
        break
      case JobStatus.Completed:
      case JobStatus.Failed:
        setButtonColor('primary')
        setButtonIcon(asCronJob ? save : refresh)
        break
      case JobStatus.Running:
      case JobStatus.Starting:
      case JobStatus.Registered:
        setButtonColor('danger')
        setButtonIcon(stop)
        break
      default:
        setButtonColor('primary')
        setButtonIcon(asCronJob ? save : play)
    }
    setRecentlyClicked(false)
  }, [jobStatus, asCronJob])

  return (
    <Button
      variant='contained_icon'
      disable={recentlyClicked}
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
          confirmRemove()
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
        setRecentlyClicked(true)
      }}
      disabled={recentlyClicked}
    >
      {jobStatus === JobStatus.Running && !hovering ? (
        <CircularProgress size={16} variant='indeterminate' color='neutral' />
      ) : (
        <Icon data={buttonIcon} />
      )}
    </Button>
  )
}

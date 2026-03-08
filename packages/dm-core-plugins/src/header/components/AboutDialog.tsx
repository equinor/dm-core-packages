import { Dialog, type TApplication } from '@development-framework/dm-core'
import { Button, Icon } from '@equinor/eds-core-react'
import { close, info_circle } from '@equinor/eds-icons'
import { useState } from 'react'

type AboutDialogProps = {
  applicationEntity: TApplication
}

export const AboutDialog = (props: AboutDialogProps) => {
  const { applicationEntity } = props
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  return (
    <>
      <Button
        aria-haspopup='dialog'
        aria-label='Open application information dialog'
        variant='ghost_icon'
        onClick={() => setIsInfoDialogOpen(true)}
      >
        <Icon data={info_circle} size={24} />
      </Button>
      <Dialog
        isDismissable
        open={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
      >
        <Dialog.Header>
          <Dialog.Title>About {applicationEntity.label}</Dialog.Title>
          <Button
            aria-label='Close application information dialog'
            variant='ghost_icon'
            onClick={() => setIsInfoDialogOpen(false)}
          >
            <Icon data={close} size={16} />
          </Button>
        </Dialog.Header>
        <Dialog.CustomContent>
          {applicationEntity.description ||
            'No description provided for this application.'}
        </Dialog.CustomContent>
      </Dialog>
    </>
  )
}

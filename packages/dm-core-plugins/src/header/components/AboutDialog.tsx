import { Dialog, TApplication } from '@development-framework/dm-core'
import { Button, Icon } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'

type AboutDialogProps = {
  isOpen: boolean
  setIsOpen: (newValue: boolean) => void
  applicationEntity: TApplication
}

export const AboutDialog = (props: AboutDialogProps) => {
  const { isOpen, setIsOpen, applicationEntity } = props

  return (
    <Dialog
      isDismissable
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width={'40vw'}
    >
      <Dialog.Header>
        <Dialog.Title>About {applicationEntity.label}</Dialog.Title>
        <Button
          variant='ghost'
          onClick={() => {
            setIsOpen(false)
          }}
        >
          <Icon data={close} size={16} title='Close' />
        </Button>
      </Dialog.Header>
      <Dialog.CustomContent>
        {applicationEntity.description}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button onClick={() => setIsOpen(false)}>Ok</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

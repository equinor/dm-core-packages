import { Dialog } from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { TApplication } from '../types'

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

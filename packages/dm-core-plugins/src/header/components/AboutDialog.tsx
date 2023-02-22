import { Dialog } from '@development-framework/dm-core'
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
      isOpen={isOpen}
      closeScrim={() => setIsOpen(false)}
      header={`About ${applicationEntity.label}`}
      width={'40vw'}
    >
      <p style={{ padding: '0 15px' }}>{applicationEntity.description}</p>
    </Dialog>
  )
}

import React from 'react'
import { Button } from '@equinor/eds-core-react'
import { useRegistryContext } from '../RegistryContext'

export const OpenObjectButton = ({ namePath }: { namePath: string }) => {
  const { onOpen } = useRegistryContext()
  // console.log('namepath to onopenbutton', namePath)
  return (
    <Button
      variant="outlined"
      onClick={() =>
        onOpen(namePath, {
          type: 'ViewConfig',
          scope: namePath,
        })
      }
    >
      Open
    </Button>
  )
}

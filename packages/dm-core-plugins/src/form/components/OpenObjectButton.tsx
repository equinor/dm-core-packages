import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { useRegistryContext } from '../RegistryContext'

export const OpenObjectButton = ({ namePath }: { namePath: string }) => {
  const { onOpen } = useRegistryContext()

  return (
    <Button
      variant="outlined"
      onClick={() =>
        onOpen?.(namePath, {
          type: 'ViewConfig',
          scope: namePath,
        })
      }
    >
      Open
    </Button>
  )
}

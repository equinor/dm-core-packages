import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { useRegistryContext } from '../context/RegistryContext'

export const OpenObjectButton = ({
  viewId,
  namePath,
  idReference,
}: {
  viewId: string
  namePath: string
  idReference?: string
}) => {
  const { onOpen } = useRegistryContext()

  return (
    <Button
      variant="outlined"
      onClick={() =>
        onOpen?.(
          viewId || namePath,
          {
            type: 'ViewConfig',
            scope: namePath,
          },
          idReference
        )
      }
    >
      Open
    </Button>
  )
}

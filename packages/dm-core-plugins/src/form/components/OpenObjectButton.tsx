import React from 'react'
import { Button } from '@equinor/eds-core-react'
import { useRegistryContext } from '../RegistryContext'

// It is assumed that a scope can either be on attribute or have a path of  dotted (first.second.third)
export const OpenObjectButton = ({ namePath }: { namePath: string }) => {
  const { onOpen } = useRegistryContext()
  // console.log('namepath to onopenbutton', namePath)

  return (
    <Button
      variant="outlined"
      onClick={() => {
        console.log('namepath to onopenbutton vc', namePath)
        onOpen(namePath, {
          type: 'ViewConfig',
          scope: namePath,
        })
      }}
    >
      Open
    </Button>
  )
}

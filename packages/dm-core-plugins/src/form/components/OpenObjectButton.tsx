import React from 'react'
import { Button } from '@equinor/eds-core-react'
import { useRegistryContext } from '../RegistryContext'
import {
  TReferenceViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'

/**
 * Handle opening of an object inside the form plugin.
 *
 * The object to open is specified with the attributeName on the parent document.
 * If the object to open is a link reference (i.e. the object at "parentDocument.attributeName"
 * is reference of referenceType "link"), then the prop isLinkReference must be set to true
 */
export const OpenObjectButton = ({
  attributeName,
  isLinkReference,
}: {
  attributeName: string
  isLinkReference: boolean
}) => {
  const { onOpen } = useRegistryContext()

  const config: TReferenceViewConfig | TViewConfig = {
    type: isLinkReference ? 'ReferenceViewConfig' : 'ViewConfig',
    scope: attributeName,
  }

  return (
    <Button variant="outlined" onClick={() => onOpen(attributeName, config)}>
      Open
    </Button>
  )
}

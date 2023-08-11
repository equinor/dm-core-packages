import {
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { useRegistryContext } from '../context/RegistryContext'

export const OpenObjectButton = ({
  viewId,
  view,
  idReference,
}: {
  viewId: string
  view: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig
  idReference?: string
}) => {
  const { onOpen } = useRegistryContext()

  return (
    <Button
      variant="outlined"
      onClick={() => onOpen?.(viewId, view, idReference)}
    >
      Open
    </Button>
  )
}

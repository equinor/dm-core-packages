import {
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'
import { Button, Icon, Tooltip } from '@equinor/eds-core-react'
import { external_link } from '@equinor/eds-icons'
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
    <Tooltip title="Open in tab">
      <Button
        variant="ghost_icon"
        onClick={() => onOpen?.(viewId, view, idReference)}
        aria-label="Open in tab"
      >
        <Icon data={external_link} />
      </Button>
    </Tooltip>
  )
}

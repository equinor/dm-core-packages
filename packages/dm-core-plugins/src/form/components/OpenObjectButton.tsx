import {
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'
import { external_link } from '@equinor/eds-icons'
import React from 'react'
import TooltipButton from '../../common/TooltipButton'
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
    <TooltipButton
      title="Open in tab"
      button-variant="ghost_icon"
      button-onClick={() => onOpen?.(viewId, view, idReference)}
      icon={external_link}
    />
  )
}

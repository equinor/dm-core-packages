import {
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TValidEntity,
  TViewConfig,
} from '@development-framework/dm-core'
import { external_link } from '@equinor/eds-icons'
import TooltipButton from '../../common/TooltipButton'
import { useRegistryContext } from '../context/RegistryContext'

export const OpenObjectButton = ({
  viewId,
  viewConfig,
  idReference,
  entity,
}: {
  viewId: string
  viewConfig: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig
  idReference?: string
  entity?: TValidEntity
}) => {
  const { onOpen } = useRegistryContext()
  console.log(entity)

  return (
    <TooltipButton
      title='Open in tab'
      compact
      button-variant='ghost_icon'
      button-onClick={() => onOpen?.(viewId, viewConfig, entity, idReference)}
      icon={external_link}
    />
  )
}

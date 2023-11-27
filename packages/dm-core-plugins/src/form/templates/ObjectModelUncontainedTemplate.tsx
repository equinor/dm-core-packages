import { TObjectTemplate } from '../types'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  EntityView,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'

export const ObjectModelUncontainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, uiRecipe, attribute } = props
  const { watch } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const value = watch(namePath)
  const { dataSource, documentPath } = splitAddress(idReference)
  const address =
    value && value.address && value.referenceType === 'link'
      ? resolveRelativeAddress(value.address, documentPath, dataSource)
      : undefined
  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {!config.readOnly && (
          <SelectReference
            attributeType={attribute.attributeType}
            namePath={namePath}
          />
        )}
        {attribute.optional && address && !config.readOnly && (
          <RemoveObject namePath={namePath} />
        )}
        {address && !(onOpen && !uiAttribute?.showInline) && (
          <TooltipButton
            title="Expand"
            button-variant="ghost_icon"
            button-onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? chevron_up : chevron_down}
          />
        )}
        {address && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: '',
              recipe: uiRecipe?.name,
            }}
            idReference={address}
          />
        )}
      </Legend>
      {address && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
        <EntityView
          idReference={address}
          type={attribute.attributeType}
          recipeName={uiRecipe?.name}
          onOpen={onOpen}
        />
      )}
    </Fieldset>
  )
}

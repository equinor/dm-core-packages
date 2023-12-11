import { TArrayTemplate } from '../types'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { getKey, ViewCreator } from '@development-framework/dm-core'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'

export const ArrayComplexTemplate = (props: TArrayTemplate) => {
  const { namePath, attribute, uiAttribute } = props

  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [initialValue, setInitialValue] = useState(getValues(namePath))
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  const isDefined = initialValue !== undefined
  const canExpand =
    isDefined &&
    (!onOpen ||
      (uiAttribute?.functionality?.expand ?? config.functionality.expand))
  const canOpen =
    isDefined &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {attribute.optional &&
          !config.readOnly &&
          (isDefined ? (
            <RemoveObject
              namePath={namePath}
              onRemove={() => {
                setInitialValue(undefined)
                setValue(namePath, undefined)
              }}
            />
          ) : (
            <AddObject
              namePath={namePath}
              type={attribute.attributeType}
              defaultValue={[]}
              onAdd={() => setInitialValue([])}
            />
          ))}
        {canExpand && (
          <TooltipButton
            title={isExpanded ? 'Collapse' : 'Expand'}
            button-variant='ghost_icon'
            button-onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? chevron_up : chevron_down}
          />
        )}
        {canOpen && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={
              uiAttribute?.openViewConfig
                ? uiAttribute?.openViewConfig
                : {
                    type: 'ReferenceViewConfig',
                    recipe: uiRecipeName,
                    scope: namePath,
                  }
            }
          />
        )}
      </Legend>
      {canExpand && isExpanded && (
        <ViewCreator
          idReference={`${idReference}.${namePath}`}
          onOpen={onOpen}
          viewConfig={
            uiAttribute?.expandViewConfig
              ? uiAttribute?.expandViewConfig
              : {
                  type: 'ReferenceViewConfig',
                  recipe: uiRecipeName,
                }
          }
        />
      )}
    </Fieldset>
  )
}

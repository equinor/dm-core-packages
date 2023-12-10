import { TObjectTemplate } from '../types'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { ViewCreator } from '@development-framework/dm-core'
import AddObjectBySearchButton from '../components/AddObjectBySearchButton'

export const ObjectModelContainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()

  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded ?? config.showExpanded
  )
  const value = watch(namePath)
  const isCreated = value && Object.keys(value).length > 0
  const canExpand =
    isCreated &&
    (!onOpen ||
      (uiAttribute?.functionality?.expand ?? config.functionality.expand))
  const canOpen =
    isCreated &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {attribute.optional &&
          !config.readOnly &&
          (isCreated ? (
            <RemoveObject namePath={namePath} />
          ) : (
            <>
              {uiAttribute?.searchByType && (
                <AddObjectBySearchButton
                  namePath={namePath}
                  type={attribute.attributeType}
                />
              )}
              {!uiAttribute?.searchByType && (
                <AddObject
                  namePath={namePath}
                  type={attribute.attributeType}
                  defaultValue={attribute.default}
                />
              )}
            </>
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
            idReference={idReference}
            viewConfig={
              uiAttribute?.openViewConfig
                ? uiAttribute?.openViewConfig
                : {
                    type: 'ReferenceViewConfig',
                    scope: namePath,
                    recipe: uiAttribute?.uiRecipe,
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
                  recipe: uiAttribute?.uiRecipe,
                }
          }
          onChange={(data: any) => setValue(namePath, data)}
        />
      )}
    </Fieldset>
  )
}

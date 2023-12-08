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
import { EntityView, ViewCreator } from '@development-framework/dm-core'
import AddObjectBySearchButton from '../components/AddObjectBySearchButton'

export const ObjectModelContainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()

  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const value = getValues(namePath)
  const isDefined = value && Object.keys(value).length > 0

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {attribute.optional &&
          !config.readOnly &&
          (isDefined ? (
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
        {isDefined && !(onOpen && !uiAttribute?.showInline) && (
          <TooltipButton
            title={isExpanded ? 'Collapse' : 'Expand'}
            button-variant='ghost_icon'
            button-onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? chevron_up : chevron_down}
          />
        )}
        {isDefined && onOpen && !uiAttribute?.showInline && (
          <OpenObjectButton
            viewId={namePath}
            idReference={idReference}
            viewConfig={{
              type: 'ReferenceViewConfig',
              scope: namePath,
              recipe: uiAttribute?.uiRecipe,
            }}
          />
        )}
      </Legend>
      {isDefined && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
        <ViewCreator
          idReference={`${idReference}.${namePath}`}
          onOpen={onOpen}
          viewConfig={{
            type: 'ReferenceViewConfig',
            recipe: uiAttribute?.uiRecipe,
          }}
          onChange={(data: any) => setValue(namePath, data)}
        />
      )}
    </Fieldset>
  )
}

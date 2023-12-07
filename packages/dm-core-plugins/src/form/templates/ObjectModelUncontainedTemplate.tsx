import { TObjectTemplate } from '../types'
import React, { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  EntityView,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { Fieldset } from '../styles'
import { Chip, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_right, chevron_down } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'
import { add } from 'lodash'

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

  const isExpandable = useMemo(
    () => address && !(onOpen && !uiAttribute?.showInline),
    [address]
  )
  return (
    <div>
      <legend className='flex flex-row gap-2 h-10 justify-between'>
        <div className='flex items-center'>
          {isExpandable && (
            <TooltipButton
              title={isExpanded ? 'Collapse' : 'Expand'}
              button-variant='ghost_icon'
              button-onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? chevron_down : chevron_right}
            />
          )}
          <Typography
            bold={true}
            color={address ?? 'gray'}
            className={isExpandable ? 'cursor-pointer' : ''}
            onClick={() => isExpandable && setIsExpanded(!isExpanded)}
          >
            {getDisplayLabel(attribute)}
          </Typography>
          {attribute.optional && <Chip>Optional</Chip>}
        </div>
        <div className='flex items-center'>
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
          {!config.readOnly && (
            <SelectReference
              attributeType={attribute.attributeType}
              namePath={namePath}
            />
          )}
          {attribute.optional && address && !config.readOnly && (
            <RemoveObject namePath={namePath} />
          )}
        </div>
      </legend>
      {address && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
        <div className='ps-4'>
          <EntityView
            idReference={address}
            type={attribute.attributeType}
            recipeName={uiRecipe?.name}
            onOpen={onOpen}
          />
        </div>
      )}
    </div>
  )
}

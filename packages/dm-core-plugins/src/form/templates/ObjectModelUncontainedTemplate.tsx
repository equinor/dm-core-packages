import { TObjectTemplate } from '../types'
import React, { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  EntityView,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { Chip, EdsProvider, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_right, chevron_down } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'
import { Fieldset } from '../styles'

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
      <legend className='flex flex-row h-10 justify-between border-b-[2px]'>
        <div className={`flex flex-start items-center`}>
          {isExpandable && (
            <EdsProvider density='compact'>
              <TooltipButton
                title={isExpanded ? 'Collapse' : 'Expand'}
                button-variant='ghost_icon'
                button-onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? chevron_down : chevron_right}
              />
            </EdsProvider>
          )}
          <Typography
            bold={true}
            color={address === undefined ? 'gray' : ''}
            className={isExpandable ? 'cursor-pointer' : ''}
            onClick={() => {
              isExpandable && setIsExpanded(!isExpanded)
            }}
          >
            {getDisplayLabel(attribute)}
          </Typography>
          {attribute.optional && (
            <Chip style={{ marginLeft: 6 }}>Optional</Chip>
          )}
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
            <RemoveObject
              popupTitle={`Confirm Removal`}
              popupMessage={`Are sure you want to remove reference to '${namePath}'`}
              namePath={namePath}
            />
          )}
        </div>
      </legend>
      <div className='ms-4'>
        {address && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
          <div className='ps-3.5 border-l-[2px] border-b-[5px] pb-3'>
            <EntityView
              idReference={address}
              type={attribute.attributeType}
              recipeName={uiRecipe?.name}
              onOpen={onOpen}
            />
          </div>
        )}
      </div>
    </div>
  )
}

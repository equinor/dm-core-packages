import { TObjectTemplate } from '../types'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  resolveRelativeAddress,
  splitAddress,
  ViewCreator,
} from '@development-framework/dm-core'
import { Icon, Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import TooltipButton from '../../common/TooltipButton'
import {
  chevron_right,
  chevron_down,
  file_description,
  file,
} from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'

export const ObjectModelUncontainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { watch } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded ?? config.showExpanded
  )
  const value = watch(namePath)
  const { dataSource, documentPath } = splitAddress(idReference)
  const address =
    value && value.address && value.referenceType === 'link'
      ? resolveRelativeAddress(value.address, documentPath, dataSource)
      : undefined

  const referenceExists = address !== undefined
  const canExpand =
    referenceExists &&
    (uiAttribute?.functionality?.expand ?? config.functionality.expand)
  const canOpen =
    referenceExists &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  const openInTab = () => {
    onOpen?.(
      namePath,
      uiAttribute?.openViewConfig
        ? uiAttribute?.openViewConfig
        : {
            type: 'ReferenceViewConfig',
            recipe: uiAttribute?.uiRecipe,
          },
      address
    )
  }

  return (
    <div className='border border-[#6f6f6f]'>
      <legend
        className={`flex h-10 justify-between bg-[#f7f7f7] ${
          !canExpand ? 'ps-2' : 'ps-1'
        }`}
      >
        <div className={`flex flex-start items-center`}>
          {canExpand && (
            <TooltipButton
              title={isExpanded ? 'Collapse' : 'Expand'}
              button-variant='ghost_icon'
              compact
              iconSize={24}
              button-onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? chevron_down : chevron_right}
            />
          )}
          <div
            className={`flex items-center space-x-1  ${
              referenceExists ? 'cursor-pointer' : 'opacity-50'
            }
            `}
            onClick={() => {
              if (!referenceExists) return
              canExpand ? setIsExpanded(!isExpanded) : openInTab()
            }}
          >
            <Icon
              data={referenceExists ? file_description : file}
              color='#3d3d3d'
            />
            <Typography
              bold={true}
              className={referenceExists && !canExpand ? 'hover:underline' : ''}
            >
              {getDisplayLabel(attribute)}
            </Typography>
            {attribute.optional && <p className='ps-1 text-xs'>Optional</p>}
          </div>
        </div>
        <div className='flex items-center mr-2'>
          {canOpen && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={
                uiAttribute?.openViewConfig
                  ? uiAttribute?.openViewConfig
                  : {
                      type: 'ReferenceViewConfig',
                      recipe: uiAttribute?.uiRecipe,
                    }
              }
              idReference={address}
            />
          )}
          {!config.readOnly && (
            <SelectReference
              attributeType={attribute.attributeType}
              namePath={namePath}
              buttonText={referenceExists ? 'Change' : 'Select'}
            />
          )}
          {attribute.optional && referenceExists && !config.readOnly && (
            <RemoveObject
              popupTitle={`Confirm Removal`}
              popupMessage={`Are sure you want to remove reference to '${namePath}'`}
              namePath={namePath}
            />
          )}
        </div>
      </legend>
      <div>
        {canExpand && isExpanded && (
          <div className='border-t p-2 border-[#6f6f6f] overflow-scroll'>
            <ViewCreator
              idReference={address}
              onOpen={onOpen}
              viewConfig={
                uiAttribute?.expandViewConfig
                  ? uiAttribute?.expandViewConfig
                  : {
                      type: 'ReferenceViewConfig',
                      recipe: uiAttribute?.uiRecipe,
                    }
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

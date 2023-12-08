import { TObjectTemplate } from '../types'
import React, { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  EntityView,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { EdsProvider, Icon, Typography } from '@equinor/eds-core-react'
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
  const refrenceExists = address !== undefined

  const openInTab = () => {
    onOpen?.(
      namePath,
      {
        type: 'ReferenceViewConfig',
        scope: '',
        recipe: uiRecipe?.name,
      },
      address
    )
  }

  return (
    <div className='border border-[#6f6f6f]'>
      <legend className='flex h-10 justify-between bg-[#f7f7f7] ps-2 '>
        <div className={`flex flex-start items-center`}>
          {isExpandable && (
            <EdsProvider density='compact'>
              <TooltipButton
                title={isExpanded ? 'Collapse' : 'Expand'}
                button-variant='ghost_icon'
                iconSize={24}
                button-onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? chevron_down : chevron_right}
              />
            </EdsProvider>
          )}
          <div
            className={`flex  ${
              refrenceExists ? 'cursor-pointer' : 'opacity-50'
            }`}
            onClick={() => {
              if (!refrenceExists) return
              isExpandable ? setIsExpanded(!isExpanded) : openInTab()
            }}
          >
            <Icon
              data={refrenceExists ? file_description : file}
              className='mr-1'
              //color={refrenceExists ? "" : "gray"}
            />
            <Typography
              bold={true}
              //color={refrenceExists ? "" : "gray"}
              className='self-center'
            >
              {getDisplayLabel(attribute)}
            </Typography>
          </div>
        </div>
        <div className='flex items-center mr-2'>
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
              buttonText={refrenceExists ? 'Change' : 'Select'}
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
      <div className=''>
        {address && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
          <div className='border-t p-2 border-[#6f6f6f] overflow-scroll'>
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

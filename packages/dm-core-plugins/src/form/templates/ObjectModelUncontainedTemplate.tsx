import { TObjectTemplate } from '../types'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import {
  resolveRelativeAddress,
  splitAddress,
  ViewCreator,
} from '@development-framework/dm-core'
import RemoveObject from '../components/RemoveObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'
import ObjectWrapper from './shared/ObjectWrapper'
import ObjectLegendWrapper from './shared/ObjectLegendWrapper'
import ObjectLegendHeader from './shared/ObjectLegendHeader'

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
    (!onOpen ||
      (uiAttribute?.functionality?.expand ?? config.functionality.expand))
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
    <ObjectWrapper>
      <ObjectLegendWrapper>
        <ObjectLegendHeader
          canExpand={canExpand}
          isExpanded={isExpanded}
          attribute={attribute}
          referenceExists={referenceExists}
          setIsExpanded={setIsExpanded}
          openInTab={openInTab}
        />
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
      </ObjectLegendWrapper>
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
    </ObjectWrapper>
  )
}

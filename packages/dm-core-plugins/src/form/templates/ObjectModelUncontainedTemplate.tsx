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
import FormObjectBorder from './shared/FormObjectBorder'
import ObjectLegendWrapper from './shared/ObjectLegendWrapper'
import ObjectLegendHeader from './shared/ObjectLegendHeader'
import FormExpandedViewWrapper from './shared/FormExpandedViewWrapper'
import ObjectLegendActionsWrapper from './shared/ObjectLegendActionsWrapper'
import {
  ExpandViewConfig,
  InferCanOpenOrExpand,
  OpenViewConfig,
} from './shared/utils'

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

  const { canExpand, canOpenInTab } = InferCanOpenOrExpand(
    referenceExists,
    config,
    uiAttribute,
    onOpen
  )
  return (
    <FormObjectBorder>
      <ObjectLegendWrapper>
        <ObjectLegendHeader
          canExpand={canExpand}
          canOpenInTab={canOpenInTab}
          isExpanded={isExpanded}
          attribute={attribute}
          objectIsNotEmpty={referenceExists}
          setIsExpanded={setIsExpanded}
          openInTab={() =>
            onOpen?.(namePath, OpenViewConfig(uiAttribute), address)
          }
        />
        <ObjectLegendActionsWrapper>
          {canOpenInTab && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={OpenViewConfig(uiAttribute)}
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
        </ObjectLegendActionsWrapper>
      </ObjectLegendWrapper>
      {canExpand && isExpanded && (
        <FormExpandedViewWrapper>
          <ViewCreator
            idReference={address ?? ''}
            onOpen={onOpen}
            viewConfig={ExpandViewConfig(uiAttribute)}
          />
        </FormExpandedViewWrapper>
      )}
    </FormObjectBorder>
  )
}

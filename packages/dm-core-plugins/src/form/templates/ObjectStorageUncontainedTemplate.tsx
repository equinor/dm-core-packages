import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  resolveRelativeAddress,
  splitAddress,
  ViewCreator,
} from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { TObjectTemplate } from '../types'
import RemoveObject from '../components/RemoveObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'
import FormObjectBorder from './shared/FormObjectBorder'
import ObjectLegendWrapper from './shared/ObjectLegendWrapper'
import ObjectLegendHeader from './shared/ObjectLegendHeader'
import FormExpandedViewWrapper from './shared/FormExpandedViewWrapper'
import ObjectLegendActionsWrapper from './shared/ObjectLegendActionsWrapper'
import {
  InferCanOpenOrExpand,
  ExpandViewConfig,
  OpenViewConfig,
} from './shared/utils'

export const ObjectStorageUncontainedTemplate = (props: TObjectTemplate) => {
  const { namePath, attribute, uiAttribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const { dataSource, documentPath } = splitAddress(idReference)
  const [isExpanded, setIsExpanded] = useState(false)
  const { config } = useRegistryContext()
  const value = watch(namePath)
  const address = resolveRelativeAddress(
    value.address,
    documentPath,
    dataSource
  )

  const referenceExists = address !== undefined

  const { canExpand, canOpenInTab } = InferCanOpenOrExpand(
    referenceExists,
    config,
    uiAttribute
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
            onOpen?.(namePath, OpenViewConfig(uiAttribute, namePath), address)
          }
        />
        <ObjectLegendActionsWrapper>
          {canOpenInTab && referenceExists && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={OpenViewConfig(uiAttribute, namePath)}
              idReference={address}
            />
          )}
          {!config.readOnly && (
            <SelectReference
              attributeType={attribute.attributeType}
              namePath={namePath}
            />
          )}
          {attribute.optional && referenceExists && !config.readOnly && (
            <RemoveObject address={address} namePath={namePath} />
          )}
        </ObjectLegendActionsWrapper>
      </ObjectLegendWrapper>
      {canExpand && referenceExists && isExpanded && (
        <FormExpandedViewWrapper>
          <ViewCreator
            idReference={address}
            onOpen={onOpen}
            viewConfig={ExpandViewConfig(uiAttribute)}
            onChange={(data: any) => setValue(namePath, data)}
          />
        </FormExpandedViewWrapper>
      )}
    </FormObjectBorder>
  )
}

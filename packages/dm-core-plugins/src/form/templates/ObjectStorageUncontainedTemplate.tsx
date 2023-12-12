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
import FormTemplate from './shared/FormTemplate'
import {
  getCanOpenOrExpand,
  getExpandViewConfig,
  getOpenViewConfig,
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

  const { canExpand, canOpen } = getCanOpenOrExpand(
    referenceExists,
    config,
    uiAttribute
  )

  return (
    <FormTemplate>
      <FormTemplate.Header>
        <FormTemplate.Header.Title
          canExpand={canExpand}
          canOpen={canOpen}
          isExpanded={isExpanded}
          attribute={attribute}
          objectIsNotEmpty={referenceExists}
          setIsExpanded={setIsExpanded}
          onOpen={() =>
            onOpen?.(namePath, getOpenViewConfig(uiAttribute), address)
          }
        />
        <FormTemplate.Header.Actions>
          {canOpen && referenceExists && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={getOpenViewConfig(uiAttribute)}
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
        </FormTemplate.Header.Actions>
      </FormTemplate.Header>
      {canExpand && referenceExists && isExpanded && (
        <FormTemplate.Content>
          <ViewCreator
            idReference={address}
            onOpen={onOpen}
            viewConfig={getExpandViewConfig(uiAttribute)}
            onChange={(data: any) => setValue(namePath, data)}
          />
        </FormTemplate.Content>
      )}
    </FormTemplate>
  )
}

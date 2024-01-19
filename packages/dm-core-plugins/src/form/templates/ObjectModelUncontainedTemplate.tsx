import {
  ViewCreator,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { link } from '@equinor/eds-icons'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { OpenObjectButton } from '../components/OpenObjectButton'
import RemoveObject from '../components/RemoveObjectButton'
import { SelectReference } from '../components/SelectReference'
import { useRegistryContext } from '../context/RegistryContext'
import { TObjectTemplate } from '../types'
import FormTemplate from './shared/FormTemplate'
import {
  getCanOpenOrExpand,
  getExpandViewConfig,
  getOpenViewConfig,
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
  const { dataSource, documentPath, attributePath } = splitAddress(idReference)
  const address =
    value && value.address && value.referenceType === 'link'
      ? resolveRelativeAddress(value.address, documentPath, dataSource, [
          ...attributePath.split('.'),
          namePath,
        ])
      : undefined

  const referenceExists = address !== undefined

  const { canExpand, canOpen } = getCanOpenOrExpand(
    referenceExists,
    config,
    uiAttribute,
    onOpen
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
          icon={link}
          uiAttribute={uiAttribute}
        />
        <FormTemplate.Header.Actions uiAttribute={uiAttribute}>
          {canOpen && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={getOpenViewConfig(uiAttribute)}
              idReference={address}
            />
          )}
          {!config.readOnly && !uiAttribute?.readOnly && (
            <SelectReference
              attributeType={attribute.attributeType}
              namePath={namePath}
              buttonText={referenceExists ? 'Change' : 'Select'}
            />
          )}
          {attribute.optional &&
            referenceExists &&
            !config.readOnly &&
            !uiAttribute?.readOnly && (
              <RemoveObject
                popupTitle={`Confirm Removal`}
                popupMessage={`Are sure you want to remove reference to '${namePath}'`}
                namePath={namePath}
              />
            )}
        </FormTemplate.Header.Actions>
      </FormTemplate.Header>
      <FormTemplate.Content expanded={!!isExpanded} canExpand={!!canExpand}>
        <ViewCreator
          idReference={address ?? ''}
          onOpen={onOpen}
          viewConfig={getExpandViewConfig(uiAttribute)}
        />
      </FormTemplate.Content>
    </FormTemplate>
  )
}

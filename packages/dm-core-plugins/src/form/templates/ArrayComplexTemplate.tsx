import { TArrayTemplate } from '../types'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { getKey, ViewCreator } from '@development-framework/dm-core'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import FormTemplate from './shared/FormTemplate'
import {
  getCanOpenOrExpand,
  getExpandViewConfig,
  getOpenViewConfig,
} from './shared/utils'

export const ArrayComplexTemplate = (props: TArrayTemplate) => {
  const { namePath, attribute, uiAttribute } = props

  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [initialValue, setInitialValue] = useState(getValues(namePath))
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : config.showExpanded
  )
  const isDefined = initialValue !== undefined

  const { canExpand, canOpen } = getCanOpenOrExpand(
    isDefined,
    config,
    uiAttribute,
    onOpen
  )
  return (
    <FormTemplate>
      <FormTemplate.Header>
        <FormTemplate.Header.Title
          canExpand={canExpand}
          objectIsNotEmpty={isDefined}
          canOpen={canOpen}
          isExpanded={isExpanded}
          onOpen={() =>
            onOpen?.(
              namePath,
              getOpenViewConfig(uiAttribute, namePath),
              idReference
            )
          }
          setIsExpanded={setIsExpanded}
          attribute={attribute}
        />
        <FormTemplate.Header.Actions>
          {attribute.optional &&
            !config.readOnly &&
            (isDefined ? (
              <RemoveObject
                namePath={namePath}
                onRemove={() => {
                  setInitialValue(undefined)
                  setValue(namePath, undefined)
                }}
              />
            ) : (
              <AddObject
                namePath={namePath}
                type={attribute.attributeType}
                defaultValue={[]}
                onAdd={() => setInitialValue([])}
              />
            ))}
          {canOpen && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={getOpenViewConfig(uiAttribute, namePath)}
            />
          )}
        </FormTemplate.Header.Actions>
      </FormTemplate.Header>
      {canExpand && isExpanded && (
        <FormTemplate.Content>
          <ViewCreator
            idReference={`${idReference}.${namePath}`}
            onOpen={onOpen}
            viewConfig={getExpandViewConfig(uiAttribute)}
          />
        </FormTemplate.Content>
      )}
    </FormTemplate>
  )
}

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
import { list } from '@equinor/eds-icons'

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
          icon={list}
          uiAttribute={uiAttribute}
        />
        {canOpen && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={getOpenViewConfig(uiAttribute, namePath)}
          />
        )}
        <FormTemplate.Header.Actions uiAttribute={uiAttribute}>
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
        </FormTemplate.Header.Actions>
      </FormTemplate.Header>
      <div className={`${canExpand && isExpanded ? '' : 'hidden'}`}>
        <FormTemplate.Content padding='px-2 pt-2'>
          <ViewCreator
            idReference={`${idReference}.${namePath}`}
            onOpen={onOpen}
            viewConfig={getExpandViewConfig(uiAttribute)}
          />
        </FormTemplate.Content>
      </div>
    </FormTemplate>
  )
}

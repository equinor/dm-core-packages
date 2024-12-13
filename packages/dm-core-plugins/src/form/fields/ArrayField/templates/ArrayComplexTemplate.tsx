import { ViewCreator } from '@development-framework/dm-core'
import { list } from '@equinor/eds-icons'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AddObject, OpenObjectButton, RemoveObject } from '../../../components'
import { useRegistryContext } from '../../../context/RegistryContext'
import { ComplexAttributeTemplate } from '../../../templates'
import type { TArrayTemplate } from '../../../types'
import {
  getCanOpenOrExpand,
  getExpandViewConfig,
  getOpenViewConfig,
} from '../../../utils'

export const ArrayComplexTemplate = (props: TArrayTemplate) => {
  const { namePath, attribute, uiAttribute } = props

  const { getValues, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()
  const [initialValue, setInitialValue] = useState(getValues(namePath))
  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded !== undefined
      ? uiAttribute?.showExpanded
      : !!config.showExpanded
  )
  const isDefined = initialValue !== undefined

  const { canExpand, canOpen } = getCanOpenOrExpand(
    isDefined,
    config,
    uiAttribute,
    onOpen
  )
  return (
    <ComplexAttributeTemplate>
      <ComplexAttributeTemplate.Header>
        <ComplexAttributeTemplate.Header.Title
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
        <ComplexAttributeTemplate.Header.Actions uiAttribute={uiAttribute}>
          {canOpen && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={getOpenViewConfig(uiAttribute, namePath)}
            />
          )}
          {attribute.optional &&
            !config.readOnly &&
            !uiAttribute?.readOnly &&
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
        </ComplexAttributeTemplate.Header.Actions>
      </ComplexAttributeTemplate.Header>
      <ComplexAttributeTemplate.Content
        id={`${namePath}-content`}
        $expanded={!!isExpanded}
        $canExpand={!!canExpand}
        $padding='0.5rem 0.125rem 0.125rem'
      >
        <ViewCreator
          idReference={`${idReference}.${namePath}`}
          onOpen={onOpen}
          viewConfig={getExpandViewConfig(uiAttribute)}
        />
      </ComplexAttributeTemplate.Content>
    </ComplexAttributeTemplate>
  )
}

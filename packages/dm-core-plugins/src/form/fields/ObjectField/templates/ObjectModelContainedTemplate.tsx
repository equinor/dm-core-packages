import { ViewCreator } from '@development-framework/dm-core'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  AddObject,
  AddObjectBySearchButton,
  OpenObjectButton,
  RemoveObject,
} from '../../../components'
import { useRegistryContext } from '../../../context/RegistryContext'
import { ComplexAttributeTemplate } from '../../../templates'
import type { TObjectTemplate } from '../../../types'
import {
  getCanOpenOrExpand as getCanOpenExpand,
  getExpandViewConfig,
  getOpenViewConfig,
} from '../../../utils'

export const ObjectModelContainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()

  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded ?? !!config.showExpanded
  )
  const value = watch(namePath)
  const objectIsNotEmpty = value && Object.keys(value).length > 0

  const { canExpand, canOpen } = getCanOpenExpand(
    objectIsNotEmpty,
    config,
    uiAttribute,
    onOpen
  )
  return (
    <ComplexAttributeTemplate>
      <ComplexAttributeTemplate.Header>
        <ComplexAttributeTemplate.Header.Title
          canExpand={canExpand}
          canOpen={canOpen}
          isExpanded={isExpanded}
          attribute={attribute}
          objectIsNotEmpty={objectIsNotEmpty}
          setIsExpanded={setIsExpanded}
          onOpen={() =>
            onOpen?.(
              namePath,
              getOpenViewConfig(uiAttribute, namePath),
              idReference
            )
          }
          uiAttribute={uiAttribute}
          namePath={namePath}
        />
        <ComplexAttributeTemplate.Header.Actions uiAttribute={uiAttribute}>
          {canOpen && (
            <OpenObjectButton
              viewId={namePath}
              idReference={idReference}
              viewConfig={getOpenViewConfig(uiAttribute, namePath)}
            />
          )}
          {attribute.optional &&
            !config.readOnly &&
            !uiAttribute?.readOnly &&
            !objectIsNotEmpty && (
              <>
                {uiAttribute?.searchByType && (
                  <AddObjectBySearchButton
                    namePath={namePath}
                    type={attribute.attributeType}
                  />
                )}
                {!uiAttribute?.searchByType && (
                  <AddObject
                    namePath={namePath}
                    type={attribute.attributeType}
                    defaultValue={attribute.default}
                  />
                )}
              </>
            )}
          {attribute.optional &&
            objectIsNotEmpty &&
            !config.readOnly &&
            !uiAttribute?.readOnly && (
              <RemoveObject
                popupTitle={`Confirm Removal`}
                popupMessage={`Are sure you want to remove reference to '${namePath}'`}
                namePath={namePath}
              />
            )}
        </ComplexAttributeTemplate.Header.Actions>
      </ComplexAttributeTemplate.Header>
      <ComplexAttributeTemplate.Content
        id={`${namePath}-content`}
        $expanded={!!isExpanded}
        $canExpand={!!canExpand}
      >
        <ViewCreator
          idReference={`${idReference}.${attribute.name}`}
          onOpen={onOpen}
          viewConfig={getExpandViewConfig(uiAttribute)}
          onChange={(data: Record<string, unknown>) =>
            setValue(
              namePath,
              { ...value, ...data },
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            )
          }
        />
      </ComplexAttributeTemplate.Content>
    </ComplexAttributeTemplate>
  )
}

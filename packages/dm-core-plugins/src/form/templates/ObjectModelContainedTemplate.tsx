import { TObjectTemplate } from '../types'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { ViewCreator } from '@development-framework/dm-core'
import AddObjectBySearchButton from '../components/AddObjectBySearchButton'
import FormObjectBorder from './shared/FormObjectBorder'
import ObjectLegendHeader from './shared/ObjectLegendHeader'
import FormExpandedVewWrapper from './shared/FormExpandedVewWrapper'
import ObjectLegendWrapper from './shared/ObjectLegendWrapper'
import ObjectLegendActionsWrapper from './shared/ObjectLegendActionsWrapper'

export const ObjectModelContainedTemplate = (
  props: TObjectTemplate
): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen, config } = useRegistryContext()

  const [isExpanded, setIsExpanded] = useState(
    uiAttribute?.showExpanded ?? config.showExpanded
  )
  const value = watch(namePath)
  const objectIsNotEmpty = value && Object.keys(value).length > 0

  const canOpenInTab =
    objectIsNotEmpty &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  const canExpand =
    objectIsNotEmpty &&
    (uiAttribute?.functionality?.expand ?? config.functionality.expand)

  const openInTabViewConfig = uiAttribute?.openViewConfig
    ? uiAttribute?.openViewConfig
    : {
        type: 'ReferenceViewConfig',
        scope: namePath,
        recipe: uiAttribute?.uiRecipe,
      }
  return (
    <FormObjectBorder>
      <ObjectLegendWrapper>
        <ObjectLegendHeader
          canExpand={canExpand}
          canOpenInTab={canOpenInTab}
          isExpanded={isExpanded}
          attribute={attribute}
          objectIsNotEmpty={objectIsNotEmpty}
          setIsExpanded={setIsExpanded}
          openInTab={() => onOpen?.(namePath, openInTabViewConfig, idReference)}
        />
        <ObjectLegendActionsWrapper>
          {canOpenInTab && (
            <OpenObjectButton
              viewId={namePath}
              idReference={idReference}
              viewConfig={openInTabViewConfig}
            />
          )}
          {attribute.optional && !config.readOnly && (
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
          {attribute.optional && objectIsNotEmpty && !config.readOnly && (
            <RemoveObject
              popupTitle={`Confirm Removal`}
              popupMessage={`Are sure you want to remove reference to '${namePath}'`}
              namePath={namePath}
            />
          )}
        </ObjectLegendActionsWrapper>
      </ObjectLegendWrapper>
      {canExpand && isExpanded && (
        <FormExpandedVewWrapper>
          <ViewCreator
            idReference={`${idReference}.${namePath}`}
            onOpen={onOpen}
            viewConfig={
              uiAttribute?.expandViewConfig
                ? uiAttribute?.expandViewConfig
                : {
                    type: 'ReferenceViewConfig',
                    recipe: uiAttribute?.uiRecipe,
                  }
            }
            onChange={(data: any) => setValue(namePath, data)}
          />
        </FormExpandedVewWrapper>
      )}
    </FormObjectBorder>
  )
}

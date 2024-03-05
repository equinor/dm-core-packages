import {
  ViewCreator,
  resolveRelativeAddress,
  splitAddress,
} from '@development-framework/dm-core'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { OpenObjectButton } from '../../../components/OpenObjectButton'
import RemoveObject from '../../../components/RemoveObjectButton'
import { useRegistryContext } from '../../../context/RegistryContext'
import { ComplexAttributeTemplate } from '../../../templates'
import { TObjectTemplate } from '../../../types'
import {
  getCanOpenOrExpand,
  getExpandViewConfig,
  getOpenViewConfig,
} from '../../../utils'

export const ObjectStorageUncontainedTemplate = (props: TObjectTemplate) => {
  const { namePath, attribute, uiAttribute } = props
  const { watch } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const { dataSource, documentPath } = splitAddress(idReference)
  const [isExpanded, setIsExpanded] = useState(false)
  const { config } = useRegistryContext()
  const value = watch(namePath)
  const address =
    value && resolveRelativeAddress(value.address, documentPath, dataSource)
  const referenceExists = address !== undefined

  const { canExpand, canOpen } = getCanOpenOrExpand(
    referenceExists,
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
          objectIsNotEmpty={referenceExists}
          setIsExpanded={setIsExpanded}
          onOpen={() =>
            onOpen?.(namePath, getOpenViewConfig(uiAttribute), address)
          }
          uiAttribute={uiAttribute}
        />
        <ComplexAttributeTemplate.Header.Actions uiAttribute={uiAttribute}>
          {canOpen && referenceExists && (
            <OpenObjectButton
              viewId={namePath}
              viewConfig={getOpenViewConfig(uiAttribute)}
              idReference={address}
            />
          )}
          {/*TODO: Decide if it should be possibele to create Storage Uncontained attributes on the fly*/}
          {/*{!referenceExists && (*/}
          {/*  <AddStorageUncontained*/}
          {/*    type={attribute.attributeType}*/}
          {/*    namePath={namePath}*/}
          {/*  />*/}
          {/*)}*/}
          {attribute.optional && referenceExists && !config.readOnly && (
            <RemoveObject namePath={namePath} />
          )}
        </ComplexAttributeTemplate.Header.Actions>
      </ComplexAttributeTemplate.Header>
      <div
        className={`${
          canExpand && isExpanded && referenceExists ? '' : 'hidden'
        }`}
      >
        <ComplexAttributeTemplate.Content
          expanded={!!isExpanded}
          canExpand={!!(canExpand && referenceExists)}
        >
          <ViewCreator
            idReference={address}
            onOpen={onOpen}
            viewConfig={getExpandViewConfig(uiAttribute)}
          />
        </ComplexAttributeTemplate.Content>
      </div>
    </ComplexAttributeTemplate>
  )
}

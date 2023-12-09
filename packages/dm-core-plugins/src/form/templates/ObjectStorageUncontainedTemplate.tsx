import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  resolveRelativeAddress,
  splitAddress,
  ViewCreator,
} from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { TObjectTemplate } from '../types'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'

export const ObjectStorageUncontainedTemplate = (props: TObjectTemplate) => {
  const { namePath, attribute, uiAttribute } = props
  const { watch, setValue } = useFormContext()
  const { idReference, onOpen } = useRegistryContext()
  const { dataSource, documentPath } = splitAddress(idReference)
  const { config } = useRegistryContext()
  const value = watch(namePath)
  const address = resolveRelativeAddress(
    value.address,
    documentPath,
    dataSource
  )

  const referenceExists = address !== undefined
  const canExpand =
    referenceExists &&
    (uiAttribute?.functionality?.expand ?? config.functionality.expand)
  const canOpen =
    referenceExists &&
    onOpen &&
    (uiAttribute?.functionality?.open ?? config.functionality.open)

  return (
    <Fieldset>
      <Legend>
        <Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
        {!config.readOnly && (
          <SelectReference
            attributeType={attribute.attributeType}
            namePath={namePath}
          />
        )}
        {attribute.optional && address && !config.readOnly && (
          <RemoveObject address={address} namePath={namePath} />
        )}
        {canOpen && (
          <OpenObjectButton
            viewId={namePath}
            viewConfig={
              uiAttribute?.openViewConfig
                ? uiAttribute?.openViewConfig
                : {
                    type: 'ReferenceViewConfig',
                    scope: namePath,
                    recipe: uiAttribute?.uiRecipe,
                  }
            }
            idReference={address}
          />
        )}
      </Legend>
      {canExpand && (
        <ViewCreator
          idReference={address}
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
      )}
    </Fieldset>
  )
}

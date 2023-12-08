import {
  EBlueprint,
  getKey,
  Loading,
  useBlueprint,
} from '@development-framework/dm-core'
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { getWidget } from '../context/WidgetContext'
import { TField, TUiRecipeForm } from '../types'
import { defaultConfig } from '../components/Form'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'
import { ObjectStorageUncontainedTemplate } from '../templates/ObjectStorageUncontainedTemplate'
import { ObjectModelContainedTemplate } from '../templates/ObjectModelContainedTemplate'
import { ObjectModelUncontainedTemplate } from '../templates/ObjectModelUncontainedTemplate'

export const ObjectField = (props: TField): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { getValues } = useFormContext()
  const values = getValues(namePath)
  const isStorageUncontained =
    values !== undefined &&
    'referenceType' in values &&
    values['referenceType'] === 'storage'
  if (uiAttribute?.widget) {
    const Widget = getWidget(uiAttribute.widget)
    return (
      <Controller
        name={namePath}
        rules={{
          required: attribute.optional ? false : 'Required',
        }}
        defaultValue={attribute.default ?? ''}
        render={({
          field: { ref, value, onChange },
          fieldState: { isDirty },
        }) => {
          return (
            <Widget
              value={value}
              onChange={onChange}
              config={uiAttribute?.config}
              label={getDisplayLabelWithOptional(attribute)}
              isDirty={isDirty}
              inputRef={ref}
              id={isStorageUncontained ? values['address'] : namePath}
              // if the attribute type is an object, we need to find the correct type from the values.
            />
          )
        }}
      />
    )
  }

  return (
    <ObjectTemplateSelector
      namePath={namePath}
      attribute={{
        ...attribute,
        attributeType:
          values && values.type !== EBlueprint.REFERENCE && 'type' in values
            ? values.type
            : attribute.attributeType,
      }}
      uiAttribute={uiAttribute}
    />
  )
}

export const ObjectTemplateSelector = (props: TField): React.ReactElement => {
  const { namePath, uiAttribute, attribute } = props
  const { watch } = useFormContext()
  const value = watch(namePath)
  const isStorageUncontained =
    value !== undefined &&
    'referenceType' in value &&
    value['referenceType'] === 'storage'

  const isModelContained = attribute.contained ?? true

  const Template = isStorageUncontained
    ? ObjectStorageUncontainedTemplate
    : isModelContained
      ? ObjectModelContainedTemplate
      : ObjectModelUncontainedTemplate

  return (
    <Template
      attribute={attribute}
      namePath={namePath}
      uiAttribute={uiAttribute}
    />
  )
}

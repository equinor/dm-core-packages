import { EBlueprint } from '@development-framework/dm-core'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { getWidget } from '../../context/WidgetContext'
import { TField } from '../../types'
import { getDisplayLabel } from '../../utils/getDisplayLabel'
import { ObjectModelContainedTemplate } from './templates/ObjectModelContainedTemplate'
import { ObjectModelUncontainedTemplate } from './templates/ObjectModelUncontainedTemplate'
import { ObjectStorageUncontainedTemplate } from './templates/ObjectStorageUncontainedTemplate'

export const ObjectField = (
  props: TField & { isStorageUncontained: boolean }
): React.ReactElement => {
  const { namePath, uiAttribute, attribute, isStorageUncontained } = props
  const { getValues, control } = useFormContext()
  const values = getValues(namePath)

  if (uiAttribute?.widget) {
    const Widget = getWidget(uiAttribute.widget)
    return (
      <Controller
        name={namePath}
        control={control}
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
              label={getDisplayLabel(attribute, true)}
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
      isStorageUncontained={isStorageUncontained}
    />
  )
}

export const ObjectTemplateSelector = (
  props: TField & { isStorageUncontained: boolean }
): React.ReactElement => {
  const { namePath, uiAttribute, attribute, isStorageUncontained } = props

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

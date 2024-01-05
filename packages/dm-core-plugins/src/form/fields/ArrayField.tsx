import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TArrayTemplate } from '../types'
import { getWidget } from '../context/WidgetContext'
import { getDisplayLabelWithOptional } from '../utils/getDisplayLabel'
import { ArrayComplexTemplate } from '../templates/ArrayComplexTemplate'
import { isPrimitiveType } from '../utils/isPrimitiveType'
import arrayTemplates from '../templates'

export default function ArrayField(props: TArrayTemplate) {
  const { uiAttribute, namePath, attribute } = props
  const { getValues, setValue, control } = useFormContext()

  if (isPrimitiveType(attribute.attributeType) && uiAttribute?.widget) {
    const value = getValues(namePath)
    const Widget = getWidget(uiAttribute.widget)
    return (
      <Widget
        id={namePath}
        onChange={(values) =>
          setValue(namePath, values, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        config={uiAttribute?.config}
        enumType={attribute.enumType || undefined}
        value={value}
        label={getDisplayLabelWithOptional(attribute)}
      />
    )
  }

  if (isPrimitiveType(attribute.attributeType)) {
    return (
      <Controller
        name={namePath}
        control={control}
        render={({ field: { value, onChange } }) => {
          // TODO: make this into same as getWidget(uiAttribute?.template)
          const templates = { ...arrayTemplates }
          const templateName = uiAttribute?.template
          const Template =
            templates[templateName ?? 'ArrayPrimitiveDatagridTemplate']
          return (
            <Template
              namePath={namePath}
              onChange={onChange}
              value={value ?? []}
              uiAttribute={uiAttribute}
              attribute={attribute}
            />
          )
        }}
      />
    )
  }

  return (
    <ArrayComplexTemplate
      namePath={namePath}
      uiAttribute={uiAttribute}
      attribute={attribute}
    />
  )
}

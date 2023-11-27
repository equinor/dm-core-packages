import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TArrayTemplate } from '../types'
import { getWidget } from '../context/WidgetContext'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import { ArrayComplexTemplate } from '../templates/ArrayComplexTemplate'
import { isPrimitiveType } from '../utils/isPrimitiveType'
import { ArrayPrimitiveTemplate } from '../templates/ArrayPrimitiveTemplate'

export default function ArrayField(props: TArrayTemplate) {
  const { uiAttribute, namePath, attribute } = props

  if (isPrimitiveType(attribute.attributeType) && uiAttribute?.widget) {
    const { getValues, setValue } = useFormContext()
    const value = getValues(namePath)
    const Widget = getWidget(uiAttribute.widget)
    return (
      <Widget
        id={namePath}
        onChange={(values) => setValue(namePath, values)}
        config={uiAttribute?.config}
        enumType={attribute.enumType || undefined}
        value={value}
        label={getDisplayLabel(attribute)}
      />
    )
  }

  if (isPrimitiveType(attribute.attributeType)) {
    return (
      <Controller
        name={namePath}
        render={({ field: { value, onChange } }) => {
          return (
            <ArrayPrimitiveTemplate
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

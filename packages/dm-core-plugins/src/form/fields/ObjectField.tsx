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
import { getDisplayLabel } from '../utils/getDisplayLabel'
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
          field: { ref, value, onChange, ...props },
          fieldState: { isDirty },
        }) => {
          return (
            <Widget
              {...props}
              value={value}
              onChange={onChange}
              label={getDisplayLabel(attribute)}
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
  const { blueprint, uiRecipes, isLoading, error } = useBlueprint(
    attribute.attributeType
  )
  const { watch } = useFormContext()
  const value = watch(namePath)
  if (isLoading) return <Loading />
  if (error)
    throw new Error(
      `Failed to fetch blueprint for '${attribute.attributeType}'`
    )
  if (blueprint === undefined) return <div>Could not find the blueprint</div>
  const isStorageUncontained =
    value !== undefined &&
    'referenceType' in value &&
    value['referenceType'] === 'storage'

  // The nested objects uses ui recipes names that are passed down from parent configs.
  const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
  const uiRecipesWithDefaultConfig: TUiRecipeForm[] = uiRecipes.map((x) => ({
    ...x,
    config: { ...defaultConfig, ...x.config },
  }))

  let uiRecipe: TUiRecipeForm | undefined = uiRecipesWithDefaultConfig[0] // By default, use the first recipe in the list

  if (uiRecipeName) {
    // If there is a recipe specified in the config, select that.
    uiRecipe = uiRecipesWithDefaultConfig.find(
      (uiRecipe) => uiRecipe.name === uiRecipeName
    )
  }

  if (!uiRecipe)
    throw new Error(
      `No UiRecipe named "${uiRecipeName}" could be found for type "${attribute.attributeType}"`
    )

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
      blueprint={blueprint}
      uiRecipe={uiRecipe}
      uiAttribute={uiAttribute}
    />
  )
}

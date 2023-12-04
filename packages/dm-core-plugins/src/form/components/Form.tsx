import * as React from 'react'
import { useContext } from 'react'

import {
  ApplicationContext,
  EBlueprint,
  findRecipe,
  Loading,
  TAttribute,
  TGenericObject,
  TUiRecipe,
  useBlueprint,
  useDMSS,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { RegistryProvider } from '../context/RegistryContext'
import { TFormConfig, TFormProps, TUiAttributeObject } from '../types'
import { AttributeList } from './AttributeList'
import { isPrimitiveType } from '../utils/isPrimitiveType'

const Wrapper = styled.div`
  max-width: 650px;
  width: 100%;
  padding: 1rem 0;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`

export const defaultConfig: TFormConfig = {
  attributes: [],
  fields: [],
  readOnly: false,
  showExpanded: true,
}

export const Form = (props: TFormProps) => {
  const { type, formData, onSubmit, idReference, onOpen } = props
  const { blueprint, isLoading, error } = useBlueprint(type)
  const dmssAPI = useDMSS()
  const { name } = useContext(ApplicationContext)

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  props?.onChange &&
    methods.watch((data: any) => props?.onChange && props.onChange(data))

  const config: TFormConfig = { ...defaultConfig, ...props.config }

  // Every react hook form controller needs to have a unique name
  const namePath: string = ''

  const preparePayload = async (obj: TGenericObject) => {
    // Since react-hook-form cannot handle null values,
    // we have to convert null values to undefined before submitting.
    for (const key of Object.keys(obj)) {
      if (obj[key] === null) {
        obj[key] = undefined
      }
    }

    // Remove attributes that should not be in the payload,
    // that is complex objects that are not using the form plugin (or is not shown inline),
    // and complex arrays (since they are using other plugins then the form plugin).

    const toRemoveFromPayload: string[] = []
    for (const key of Object.keys(obj)) {
      const isComplexObject =
        obj[key] !== null &&
        typeof obj[key] === 'object' &&
        'type' in obj[key] &&
        obj[key].type !== EBlueprint.REFERENCE

      if (isComplexObject) {
        // Remove if not shown inline
        const uiAttribute: TUiAttributeObject | undefined =
          config?.attributes.find((attribute) => attribute.name == key)
        if (!uiAttribute?.showInline) {
          toRemoveFromPayload.push(key)
          continue
        }

        // Remove if not use the form plugin
        const response: any = await dmssAPI.blueprintGet({
          typeRef: obj[key].type,
          context: name,
        })
        const uiRecipe: TUiRecipe = findRecipe(
          response.data.uiRecipes,
          response.data.initialUiRecipe,
          uiAttribute?.uiRecipe
        )
        // TODO: Find a better way to determine if the target plugin support onSubmit
        if (uiRecipe.plugin !== '@development-framework/dm-core-plugins/form') {
          toRemoveFromPayload.push(key)
          continue
        }
      }

      const attribute = blueprint?.attributes.find(
        (attribute: TAttribute) => attribute.name == key
      )
      const isComplexArray =
        Array.isArray(obj[key]) && !isPrimitiveType(attribute.attributeType)
      if (isComplexArray) {
        toRemoveFromPayload.push(key)
      }
    }
    toRemoveFromPayload.forEach((key) => delete obj[key])
    return obj
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (onSubmit !== undefined) onSubmit(await preparePayload(data))
  })

  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const showSubmitButton = props.showSubmitButton ?? true

  return (
    <FormProvider {...methods}>
      <RegistryProvider
        onOpen={onOpen}
        idReference={idReference}
        config={{ ...defaultConfig, ...props.config }}
      >
        <Wrapper>
          <AttributeList namePath={namePath} blueprint={blueprint} />
          {showSubmitButton && !config?.readOnly && (
            <Button
              type='submit'
              data-testid='form-submit'
              style={{ alignSelf: 'flex-start' }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </Wrapper>
      </RegistryProvider>
    </FormProvider>
  )
}

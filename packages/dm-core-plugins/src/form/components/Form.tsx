import { useState } from 'react'

import {
  EBlueprint,
  Loading,
  TAttribute,
  TGenericObject,
  TUiRecipe,
  findRecipe,
  useApplication,
  useBlueprint,
} from '@development-framework/dm-core'
import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { undo } from '@equinor/eds-icons'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { RegistryProvider } from '../context/RegistryContext'
import { TFormConfig, TFormProps, TUiAttributeObject } from '../types'
import { getCanOpenOrExpand, isPrimitiveType } from '../utils'
import { AttributeList } from './AttributeList'

const FORM_DEFAULT_MAX_WIDTH = '650px'

export const defaultConfig: TFormConfig = {
  attributes: [],
  fields: [],
  readOnly: false,
  showExpanded: true,
  functionality: {
    expand: false,
    open: true,
  },
}

export const Form = (props: TFormProps) => {
  const { type, formData, onSubmit, idReference, onOpen } = props
  const { blueprint, storageRecipes, isLoading, error } = useBlueprint(type)
  const { dmssAPI, name } = useApplication()
  const [reloadCounter, setReloadCounter] = useState(0)
  const showSubmitButton = props.showSubmitButton ?? true
  // Every react hook form controller needs to have a unique name
  const namePath: string = showSubmitButton
    ? ''
    : idReference.split('.').length > 1
      ? `${idReference.split('.').slice(-1)}`
      : ''

  const rootMethods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  const childMethods = useFormContext()

  const methods = showSubmitButton ? rootMethods : childMethods

  const handleCustomReset = () => {
    methods.reset()
    setReloadCounter(reloadCounter + 1)
  }

  const config: TFormConfig = {
    ...defaultConfig,
    ...props.config,
    functionality: {
      ...defaultConfig.functionality,
      ...props.config?.functionality,
    },
  }

  const replaceNull = (obj: TGenericObject) => {
    for (const key of Object.keys(obj)) {
      if (obj[key] === null) {
        obj[key] = undefined
      } else if (isComplexObject(obj[key])) {
        replaceNull(obj[key])
      }
    }
  }

  const isComplexObject = (attr: TGenericObject) => {
    return (
      attr !== null &&
      typeof attr === 'object' &&
      'type' in attr &&
      attr.type !== EBlueprint.REFERENCE
    )
  }

  const preparePayload = async (obj: TGenericObject) => {
    // Since react-hook-form cannot handle null values,
    // we have to convert null values to undefined before submitting.
    replaceNull(obj)

    // Remove attributes that should not be in the payload,
    // that is complex objects that are not using the form plugin (or is not shown inline),
    // and complex arrays (since they are using other plugins then the form plugin).

    const toRemoveFromPayload: string[] = []
    for (const key of Object.keys(obj)) {
      if (isComplexObject(obj[key])) {
        // Remove if not shown inline
        const uiAttribute: TUiAttributeObject | undefined =
          config?.attributes.find((attribute) => attribute.name === key)

        if (uiAttribute?.widget) continue

        const { canExpand } = getCanOpenOrExpand(
          obj[key] !== undefined,
          config,
          uiAttribute
        )

        if (!canExpand) {
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
        (attribute: TAttribute) => attribute.name === key
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

  const disabled = isLoading || !methods.formState.isDirty

  const content = () => {
    return (
      <RegistryProvider
        onOpen={onOpen}
        idReference={idReference}
        config={{ ...defaultConfig, ...props.config }}
      >
        <div
          className='flex-layout-container dm-plugin-padding dm-parent-plugin'
          style={{ maxWidth: FORM_DEFAULT_MAX_WIDTH }}
        >
          <AttributeList
            namePath={namePath}
            blueprint={blueprint}
            storageRecipes={storageRecipes ?? []}
          />
          {showSubmitButton && !config?.readOnly && (
            <EdsProvider
              density={config?.compactButtons ? 'compact' : 'comfortable'}
            >
              <div
                className={`flex space-x-2 justify-start items-center ${
                  config?.compactButtons ? 'mt-2' : 'mt-4'
                }`}
              >
                <Button
                  onClick={handleCustomReset}
                  disabled={disabled}
                  tooltip={'Revert changes'}
                  variant={'outlined'}
                  data-testid='form-reset'
                  className='overflow-hidden'
                >
                  <Icon data={undo} size={16} />
                </Button>
                <Button
                  type='submit'
                  data-testid='form-submit'
                  onClick={handleSubmit}
                  className='overflow-hidden'
                >
                  Submit
                </Button>
              </div>
            </EdsProvider>
          )}
        </div>
      </RegistryProvider>
    )
  }

  return (
    <div key={reloadCounter}>
      {showSubmitButton ? (
        <FormProvider {...methods}>{content()}</FormProvider>
      ) : (
        <>{content()}</>
      )}
    </div>
  )
}

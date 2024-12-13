import { useEffect, useState } from 'react'

import {
  EBlueprint,
  Loading,
  type TAttribute,
  type TGenericObject,
  type TUiRecipe,
  findRecipe,
  useApplication,
  useBlueprint,
} from '@development-framework/dm-core'
import { Button, EdsProvider, Icon, Typography } from '@equinor/eds-core-react'
import { undo } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { Stack } from '../../common'
import { ConditionalWrapper } from '../../utils'
import { RegistryProvider } from '../context/RegistryContext'
import type { TFormConfig, TFormProps, TUiAttributeObject } from '../types'
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

export const FormWrapper = styled(Stack)`
  background: ${tokens.colors.ui.background__light.rgba};
  border-radius: 0.375rem;
  border-width: 1px;
  padding: 0.5rem;
`

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

  useEffect(() => {
    if (formData) {
      rootMethods.reset(formData, { keepDefaultValues: false })
    }
  }, [formData])

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
        <div className='dm-plugin-padding dm-parent-plugin'>
          <ConditionalWrapper
            condition={showSubmitButton}
            wrapper={(child: any) => (
              <FormWrapper style={{ maxWidth: FORM_DEFAULT_MAX_WIDTH }}>
                {child}
              </FormWrapper>
            )}
          >
            <Stack
              grow={1}
              minHeight={0}
              fullWidth
              padding={showSubmitButton ? 0.5 : 0}
              style={{
                maxWidth: FORM_DEFAULT_MAX_WIDTH,
                background: 'white',
                borderRadius: '0.375rem',
              }}
            >
              {config?.title ||
                (config?.description && (
                  <Stack padding={[0, 0, 1, 0]}>
                    {config?.title && (
                      <Typography variant='h3'>{config.title}</Typography>
                    )}
                    {config?.description && (
                      <Typography>{config.description}</Typography>
                    )}
                  </Stack>
                ))}
              <AttributeList
                namePath={namePath}
                blueprint={blueprint}
                storageRecipes={storageRecipes ?? []}
              />
            </Stack>
            {showSubmitButton && !config?.readOnly && (
              <EdsProvider
                density={config?.compactButtons ? 'compact' : 'comfortable'}
              >
                <Stack
                  direction='row'
                  spacing={0.5}
                  justifyContent='flex-end'
                  alignItems='center'
                  padding={[0.5, 0.5]}
                >
                  <Button
                    onClick={handleCustomReset}
                    disabled={disabled}
                    variant={'outlined'}
                    data-testid='form-reset'
                    style={{ overflow: 'hidden' }}
                  >
                    <Icon data={undo} size={16} />
                  </Button>
                  <Button
                    type='submit'
                    data-testid='form-submit'
                    onClick={handleSubmit}
                    style={{ overflow: 'hidden' }}
                  >
                    Submit
                  </Button>
                </Stack>
              </EdsProvider>
            )}
          </ConditionalWrapper>
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

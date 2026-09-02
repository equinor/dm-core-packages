import {
  EBlueprint,
  findRecipe,
  Loading,
  type TAttribute,
  type TGenericObject,
  type TUiRecipe,
  useApplication,
  useBlueprint,
} from '@development-framework/dm-core'
import { Button, EdsProvider, Icon, Typography } from '@equinor/eds-core-react'
import { undo } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { Stack } from '../../common'
import { ConditionalWrapper } from '../../utils'
import { RegistryProvider } from '../context/RegistryContext'
import type { TFormConfig, TFormProps, TUiAttributeObject } from '../types'
import { getCanOpenOrExpand, isPrimitiveType } from '../utils'
import { AttributeList } from './AttributeList'

const FORM_DEFAULT_MAX_WIDTH = '650px'

// Plugins that never own their own persistence - they just lay out/select between
// children and pass onSubmit/onChange straight through to whatever's nested inside
// (which is often the form plugin, e.g. a type with no dedicated recipe falls back to
// a Tabs recipe showing "Yaml" + "Edit"). Their presence here doesn't mean the data is
// unsupported - only plugins with their own independent save flow (Table, List, Graph,
// etc.) should be excluded from the parent's payload.
const PASSTHROUGH_CONTAINER_PLUGINS = new Set([
  '@development-framework/dm-core-plugins/form',
  '@development-framework/dm-core-plugins/stack',
  '@development-framework/dm-core-plugins/grid',
  '@development-framework/dm-core-plugins/responsive_grid',
  '@development-framework/dm-core-plugins/view_selector/tabs',
  '@development-framework/dm-core-plugins/view_selector/sidebar',
  '@development-framework/dm-core-plugins/single_view',
])

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
  const hideSubmitButton = props.hideSubmitButton ?? false
  const namePath: string = showSubmitButton
    ? ''
    : idReference.split('.').length > 1
      ? `${idReference.split('.').slice(-1)}`
      : ''

  const rootMethods = useForm({
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
    replaceNull(obj)

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
        if (!PASSTHROUGH_CONTAINER_PLUGINS.has(uiRecipe.plugin)) {
          toRemoveFromPayload.push(key)
          continue
        }
      }

      const attribute = blueprint?.attributes.find(
        (attribute: TAttribute) => attribute.name === key
      )
      if (attribute) {
        const isComplexArray =
          Array.isArray(obj[key]) && !isPrimitiveType(attribute.attributeType)
        if (isComplexArray) {
          toRemoveFromPayload.push(key)
        }
      }
    }
    toRemoveFromPayload.forEach((key) => delete obj[key])
    return obj
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (onSubmit !== undefined) return onSubmit(await preparePayload(data))
  })

  useEffect(() => {
    props.onCoordinatorSync?.({
      isDirty: methods.formState.isDirty,
      submit: () => handleSubmit(),
    })
  }, [methods.formState.isDirty, handleSubmit])

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
            {showSubmitButton && !hideSubmitButton && !config?.readOnly && (
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

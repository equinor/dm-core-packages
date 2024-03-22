import { Loading, useBlueprint } from '@development-framework/dm-core'
import { Button, EdsProvider, Icon } from '@equinor/eds-core-react'
import { undo } from '@equinor/eds-icons'
import { pick } from 'lodash'
import { useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { RegistryProvider } from '../context/RegistryContext'
import { TFormConfig, TFormProps } from '../types'
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

  function createPathsOfDirtyFields(obj: any): string[] {
    const typePaths: string[] = []
    const paths = Object.keys(obj).flatMap((key: string) => {
      if (typeof obj[key] === 'object' && obj[key]) {
        // add type attribute for each child-entity
        typePaths.push(`${key}.type`)
        return createPathsOfDirtyFields(obj[key]).map(
          (innerKey: string) => `${key}.${innerKey}`
        )
      }
      return key
    })
    return [...typePaths, ...paths]
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    const changedFields = pick(
      data,
      ['_id', 'type'],
      createPathsOfDirtyFields(methods.formState.dirtyFields)
    )
    if (onSubmit !== undefined) onSubmit(changedFields)
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

import * as React from 'react'

import {
  Loading,
  TGenericObject,
  useBlueprint,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { RegistryProvider } from '../context/RegistryContext'
import { TFormConfig, TFormProps } from '../types'
import { AttributeList } from './AttributeList'

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

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  props?.onUpdate &&
    methods.watch((data: any) => props?.onUpdate && props.onUpdate(data))

  // Every react hook form controller needs to have a unique name
  const namePath: string = ''

  const convertNullToUndefined = (obj: TGenericObject) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null) {
        obj[key] = undefined
      }
    })
    return obj
  }

  const handleSubmit = methods.handleSubmit((data) => {
    // since react-hook-form cannot handle undefined values, we have to convert null values to undefined before submitting.
    if (onSubmit !== undefined) onSubmit(convertNullToUndefined(data))
  })

  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const config: TFormConfig = { ...defaultConfig, ...props.config }

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

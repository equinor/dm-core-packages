import * as React from 'react'

import { Stack, TGenericObject } from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { RegistryProvider } from './RegistryContext'
import { ObjectField } from './fields/ObjectField'
import { TFormProps } from './types'

const Wrapper = styled.div`
  max-width: 650px;
  width: 100%;
`

export const Form = (props: TFormProps) => {
  const { type, formData, config, onSubmit, idReference, onOpen } = props

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

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

  return (
    <Wrapper>
      <FormProvider {...methods}>
        <RegistryProvider onOpen={onOpen} idReference={idReference}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {type && (
                <ObjectField config={config} namePath={namePath} type={type} />
              )}
              <Button
                type="submit"
                data-testid="form-submit"
                style={{ alignSelf: 'flex-start' }}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </RegistryProvider>
      </FormProvider>
    </Wrapper>
  )
}

import * as React from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@equinor/eds-core-react'
import { ObjectField } from './fields/ObjectField'
import { TFormProps } from './types'
import { RegistryProvider } from './RegistryContext'
import styled from 'styled-components'
import { TGenericObject } from '@development-framework/dm-core'

const Wrapper = styled.div`
  max-width: 650px;
  width: 100%;
`

export const Form = (props: TFormProps) => {
  const { type, formData, widgets, config, onSubmit, idReference, onOpen } =
    props

  const methods = useForm({
    // Set initial state.
    defaultValues: formData || {},
  })

  // Every react hook form controller needs to have a unique name
  const attributePath = idReference?.split('.', 2).slice(-1)[0] ?? ''
  const namePath: string = attributePath === idReference ? '' : attributePath

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
        <RegistryProvider
          onOpen={onOpen}
          widgets={widgets}
          idReference={idReference}
        >
          <form onSubmit={handleSubmit}>
            {type && (
              <ObjectField config={config} namePath={namePath} type={type} />
            )}
            <Button type="submit" data-testid="form-submit">
              Submit
            </Button>
          </form>
        </RegistryProvider>
      </FormProvider>
    </Wrapper>
  )
}

import * as React from 'react'

import { TGenericObject, useBlueprint } from '@development-framework/dm-core'
import { Button, CircularProgress } from '@equinor/eds-core-react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { RegistryProvider } from '../context/RegistryContext'
import { TFormProps } from '../types'
import { AttributeList } from './AttributeList'

const Wrapper = styled.div`
  max-width: 650px;
  width: 100%;
  padding: 1rem 0;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`

export const Form = (props: TFormProps) => {
  const { type, formData, config, onSubmit, idReference, onOpen, loading } =
    props
  const { blueprint } = useBlueprint(type)

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
    <FormProvider {...methods}>
      <RegistryProvider onOpen={onOpen} idReference={idReference}>
        <Wrapper>
          <AttributeList
            namePath={namePath}
            config={config}
            blueprint={blueprint}
          />
          {!config?.readOnly && (
            <Button
              type="submit"
              data-testid="form-submit"
              style={{ alignSelf: 'flex-start' }}
              onClick={handleSubmit}
            >
              {loading && <CircularProgress size={16} />}
              Submit {loading}
            </Button>
          )}
        </Wrapper>
      </RegistryProvider>
    </FormProvider>
  )
}

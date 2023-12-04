import * as React from 'react'

import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import { Form } from './components/Form'

export const FormPlugin = (props: IUIPlugin) => {
  const { document, isLoading, updateDocument, error } = useDocument<any>(
    props.idReference,
    0
  )
  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const handleOnSubmit = (formData: TGenericObject) => {
    updateDocument(formData, true, true).then(() => {
      if (props.onSubmit) props.onSubmit(formData)
    })
  }

  const handleOnChange = (formData: TGenericObject) => {
    if (props.onChange) props.onChange(formData)
  }

  return (
    <Form
      onOpen={props.onOpen}
      idReference={props.idReference}
      type={document.type}
      config={props.config}
      formData={document}
      onSubmit={handleOnSubmit}
      onChange={props?.onChange && handleOnChange}
      showSubmitButton={!props?.onChange ?? true}
    />
  )
}

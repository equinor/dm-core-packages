import * as React from 'react'

import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { Form } from './components/Form'

export const FormPlugin = (props: IUIPlugin) => {
  const { document, isLoading, updateDocument, error } = useDocument<any>(
    props.idReference,
    0
  )
  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const handleOnSubmit = (formData: any) => {
    updateDocument(formData, true, true)
  }

  const handleOnUpdate = (formData: any) => {
    if (props?.onSubmit) props.onSubmit(formData)
  }

  return (
    <Form
      onOpen={props.onOpen}
      idReference={props.idReference}
      type={document.type}
      config={props.config}
      formData={document}
      onSubmit={handleOnSubmit}
      onUpdate={props?.onSubmit && handleOnUpdate}
      showSubmitButton={!props?.onSubmit}
    />
  )
}

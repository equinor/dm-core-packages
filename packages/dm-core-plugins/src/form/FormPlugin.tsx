import * as React from 'react'

import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { Form } from './components/Form'
import { TFormConfig } from './types'

export const defaultConfig: TFormConfig = {
  attributes: [],
  fields: [],
}

export const FormPlugin = (props: IUIPlugin) => {
  const config: TFormConfig = { ...defaultConfig, ...props.config }
  const { document, isLoading, updateDocument, error } = useDocument<any>(
    props.idReference,
    0
  )
  if (isLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const handleOnSubmit = (formData: any) => {
    updateDocument(formData, true)
  }

  return (
    <Form
      onOpen={props.onOpen}
      idReference={props.idReference}
      type={document.type}
      config={config}
      formData={document}
      onSubmit={handleOnSubmit}
    />
  )
}

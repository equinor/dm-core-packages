import * as React from 'react'

import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { Form } from './components/Form'
import { TConfig } from './types'

export const defaultConfig: TConfig = {
  attributes: [],
  fields: [],
}

export const FormPlugin = (props: IUIPlugin) => {
  const config: TConfig = { ...defaultConfig, ...props.config }
  const { document, isLoading, updateDocument, error } = useDocument<any>(
    props.idReference,
    1
  )
  if (isLoading && !document) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const handleOnSubmit = (formData: any) => {
    updateDocument(formData)
    // updateDocument(formData, true)
  }

  return (
    <Form
      onOpen={props.onOpen}
      idReference={props.idReference}
      type={document.type}
      config={config}
      formData={document}
      onSubmit={handleOnSubmit}
      loading={isLoading}
    />
  )
}

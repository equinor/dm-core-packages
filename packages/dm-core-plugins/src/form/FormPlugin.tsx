import * as React from 'react'

import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { Form } from './Form'
import { TConfig } from './types'

const defaultConfig: TConfig = {
  attributes: [],
  order: [],
}

export const FormPlugin = (props: IUIPlugin) => {
  const config: TConfig = { ...defaultConfig, ...props.config }
  const [document, loading, updateDocument, error] = useDocument<any>(
    props.idReference,
    999
  )
  if (loading) return <Loading />

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

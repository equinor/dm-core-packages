import * as React from 'react'

import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import { Form } from './Form'

export const FormPlugin = (props: IUIPlugin) => {
  const { config, onOpen } = props
  const { idReference } = props
  const [document, loading, updateDocument, error] = useDocument<any>(
    idReference,
    999
  )
  if (loading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  const handleOnSubmit = (formData: any) => {
    updateDocument(formData, true)
  }

  return (
    <Form
      onOpen={onOpen}
      idReference={idReference}
      type={document.type}
      config={config}
      formData={document}
      onSubmit={handleOnSubmit}
    />
  )
}

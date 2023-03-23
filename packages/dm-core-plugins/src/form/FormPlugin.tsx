import * as React from 'react'

import {
  BlueprintPicker,
  IUIPlugin,
  Loading,
  useBlueprint,
  useDocument,
} from '@development-framework/dm-core'
import { Form } from './Form'
import styled from 'styled-components'
import TextWidget from './widgets/TextWidget'
import { TWidget } from './types'

// The custom widgets goes under here,
// this may at some point be moved out from the form package.
const ErrorHelperText = styled.div`
  color: #b30d2f;
`

const widgets = {
  TypeWidget: (props: TWidget) => {
    const { id, namePath, label, value } = props
    const { blueprint, isLoading, error } = useBlueprint(value)

    if (isLoading) return <Loading />
    if (error) throw new Error(`Failed to fetch blueprint for '${value}'`)
    if (blueprint === undefined) return <div>Could not find the blueprint</div>

    const datasourceId = value.split('/')[0]

    return (
      <>
        <TextWidget
          id={id}
          namePath={namePath}
          label={label}
          readOnly={true}
          value={value}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          onClick={() => {
            // @ts-ignore
            window
              .open(`dmt/view/${datasourceId}/${blueprint.uid}`, '_blank')
              .focus()
          }}
        />
      </>
    )
  },
  BlueprintPickerWidget: (props: TWidget) => {
    const { label, variant, onChange, value, helperText } = props
    return (
      <>
        <BlueprintPicker
          label={label}
          variant={variant}
          onChange={onChange}
          formData={value}
        />
        {variant === 'error' ? (
          <ErrorHelperText>{helperText}</ErrorHelperText>
        ) : (
          <></>
        )}
      </>
    )
  },
}

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

  const dataSourceId = idReference.split('/')[0]

  return (
    <Form
      onOpen={onOpen}
      documentId={idReference}
      dataSourceId={dataSourceId}
      widgets={widgets}
      type={document.type}
      config={config}
      formData={document}
      onSubmit={handleOnSubmit}
    />
  )
}

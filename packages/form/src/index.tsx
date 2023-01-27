import * as React from 'react'

import {
  BlueprintPicker,
  EPluginType,
  IUIPlugin,
  Loading,
  TPlugin,
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
    const { blueprint, isLoading } = useBlueprint(value)

    if (isLoading) return <Loading />
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

const PluginComponent = (props: IUIPlugin) => {
  const { config, onOpen } = props
  const { idReference } = props
  const [document, loading, updateDocument] = useDocument<any>(idReference, 999)
  if (loading) return <Loading />

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

export const plugins: TPlugin[] = [
  {
    pluginName: 'form',
    component: PluginComponent,
  },
]

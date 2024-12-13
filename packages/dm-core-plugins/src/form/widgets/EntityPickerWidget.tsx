import {
  EntityPickerDialog,
  type TEntityPickerReturn,
} from '@development-framework/dm-core'
import { TextField } from '@equinor/eds-core-react'
import { useState } from 'react'
import styled from 'styled-components'
import type { TWidget } from '../types'

// The custom widgets goes under here,
// this may at some point be moved out from the form package.
const ErrorHelperText = styled.div`
  color: #b30d2f;
`

const EntityPickerWidget = (props: TWidget) => {
  const { label, variant, onChange, value, helperText, isDirty } = props
  const [showAddReferenceModal, setShowAddReferenceModal] =
    useState<boolean>(false)

  const handleAddReference = () => {
    setShowAddReferenceModal(true)
  }

  return (
    <>
      <TextField
        id={props.id}
        readOnly={props.readOnly}
        value={props.value}
        inputRef={props.inputRef}
        variant={props.variant}
        helperText={props.helperText}
        onClick={handleAddReference}
        onChange={() => null}
        label={label}
        type='string'
        data-testid={`form-text-widget-${props.id}`}
        style={
          isDirty && props.variant !== 'error'
            ? {
                // @ts-ignore
                '--eds-input-background': '#85babf5e',
              }
            : {}
        }
      />
      <EntityPickerDialog
        showModal={showAddReferenceModal}
        setShowModal={setShowAddReferenceModal}
        // typeFilter={attribute?.attributeType}
        onChange={(v: TEntityPickerReturn) => {
          onChange(v.address)
        }}
      />
      {variant === 'error' ? (
        <ErrorHelperText>{helperText}</ErrorHelperText>
      ) : (
        <></>
      )}
    </>
  )
}

export default EntityPickerWidget

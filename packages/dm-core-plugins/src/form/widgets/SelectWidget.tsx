import React from 'react'

import { Autocomplete } from '@equinor/eds-core-react'

import { TWidget } from '../types'
import { TEnum, useDocument } from '@development-framework/dm-core'
import { AutocompleteChanges } from '@equinor/eds-core-react/dist/types/components/Autocomplete/Autocomplete'

type TOption = {
  value: string
  label?: string
}

const SelectWidget = (props: TWidget) => {
  const { label, onChange, isDirty, enumType, config } = props

  const { document, isLoading } = useDocument<TEnum>(enumType)

  if (isLoading) return <></>

  const isMultiselect = config && config.multiline

  const onChangeHandler = (value: AutocompleteChanges<TOption>) => {
    if (isMultiselect) {
      onChange?.(value.selectedItems.map((option: TOption) => option.value))
    } else {
      onChange?.(value.selectedItems[0]?.value)
    }
  }

  const options: TOption[] | undefined = document?.values.map(
    (value: string, index: number) => {
      return {
        value: value,
        label: document.labels[index],
      }
    },
  )

  const initialSelectedOptions = options?.filter((option: TOption) =>
    isMultiselect
      ? props.value.some((value: any) => value == option.value)
      : props.value == option.value,
  )

  return (
    <Autocomplete
      id={props.id}
      loading={isLoading}
      readOnly={props.readOnly}
      initialSelectedOptions={initialSelectedOptions}
      inputRef={props.inputRef}
      variant={props.variant}
      helperText={props.helperText}
      onOptionsChange={onChangeHandler}
      multiple={isMultiselect}
      label={label}
      data-testid={`form-select-widget-${label}`}
      style={
        isDirty && props.variant !== 'error'
          ? {
              // @ts-ignore
              '--eds-input-background': '#85babf5e',
            }
          : {}
      }
      optionLabel={(option: any) => `${option?.label}`}
      options={options ? [...options] : []}
    />
  )
}

export default SelectWidget

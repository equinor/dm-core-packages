import React from 'react'
import { NumberFieldWithoutArrows } from '../components/NumberFieldWithoutArrows'
import { TWidget } from '../types'
import { Typography } from '@equinor/eds-core-react'

const NumberWidget = (props: TWidget) => {
  const { label, onChange, isDirty } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(Number(event.target.value))

  return (
    <>
      {/* <label htmlFor={props.id}>
        <Typography className={"self-center pb-2"} bold={true}>
          {label}
        </Typography>
      </label> */}
      <NumberFieldWithoutArrows
        id={props.id}
        readOnly={props.readOnly}
        label={label}
        defaultValue={props.value}
        inputRef={props.inputRef}
        variant={props.variant}
        helperText={props.helperText}
        onChange={onChangeHandler}
        type={'number'}
        data-testid={`form-number-widget-${label}`}
        style={
          isDirty && props.variant !== 'error'
            ? {
                // @ts-ignore
                '--eds-input-background': '#85babf5e',
              }
            : {}
        }
      />
    </>
  )
}

export default NumberWidget

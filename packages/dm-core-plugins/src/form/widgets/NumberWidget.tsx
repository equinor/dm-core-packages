import React from 'react'
import { TWidget } from '../types'
import { StyledNumberField } from '../components/StyledInputFields'

const NumberWidget = (props: TWidget) => {
  const { onChange } = props
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(Number(event.target.value))

  return <StyledNumberField {...props} onChange={onChangeHandler} />
}

export default NumberWidget

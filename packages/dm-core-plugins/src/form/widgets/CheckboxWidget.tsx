import React from 'react'

import { Checkbox } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
  const { value, readOnly } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        {...props}
        disabled={readOnly}
        checked={value !== undefined ? value : false}
        type='checkbox'
        data-testid='form-checkbox'
      />
      {props.variant === 'error' && (
        <p style={{ color: 'red' }}>*{props.helperText}</p>
      )}
    </div>
  )
}

export default CheckboxWidget

import React from 'react'

import { Checkbox, Tooltip } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
  const { value, readOnly, tooltip } = props
  return (
    <Tooltip title={tooltip ?? ''}>
      <span>
        <Checkbox
          {...props}
          disabled={readOnly}
          checked={value !== undefined ? value : false}
          type='checkbox'
          data-testid='form-checkbox'
        />
      </span>
    </Tooltip>
  )
}

export default CheckboxWidget

import { Checkbox, Tooltip } from '@equinor/eds-core-react'
import type { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
  const { value, readOnly, tooltip, inputRef, ...checkboxProps } = props
  return (
    <Tooltip title={tooltip ?? ''}>
      <span>
        <Checkbox
          {...checkboxProps}
          ref={inputRef}
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

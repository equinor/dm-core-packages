import { Checkbox, Tooltip } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
  const { value, readOnly, tooltip } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
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
      {props.variant === 'error' && (
        <p style={{ color: 'red', marginLeft: '5px' }}>*{props.helperText}</p>
      )}
    </div>
  )
}

export default CheckboxWidget

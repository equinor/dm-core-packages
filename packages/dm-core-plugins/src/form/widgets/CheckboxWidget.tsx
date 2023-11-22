import React, { ChangeEvent } from 'react'

import { Checkbox, Label } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
  const { value, readOnly, leftAdornments, rightAdornments } = props
  if (leftAdornments || rightAdornments)
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'column wrap',
          flexDirection: 'row',
          alignItems: 'center',
          border: '1px lightgrey solid',
          width: '100px',
          textAlign: 'center',
          justifyContent: 'space-around',
          borderRadius: '5px',
        }}
      >
        {/*@ts-ignore*/}
        <Label label={leftAdornments} />
        <Checkbox
          disabled={readOnly}
          checked={typeof value === 'undefined' ? false : value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            props.onChange(e.target.checked)
          }
          type="checkbox"
          data-testid="form-checkbox"
        />
        {rightAdornments}
      </div>
    )

  return (
    <Checkbox
      {...props}
      disabled={readOnly}
      checked={value !== undefined ? value : false}
      type="checkbox"
      data-testid="form-checkbox"
    />
  )
}

export default CheckboxWidget

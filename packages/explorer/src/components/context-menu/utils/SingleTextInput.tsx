import { Button, Input, Label } from '@equinor/eds-core-react'
import { INPUT_FIELD_WIDTH } from '@development-framework/dm-core'
import React from 'react'
import { edsButtonStyleConfig } from './styledComponents'

export const SingleTextInput = (props: {
  label: string
  handleSubmit: () => void
  setFormData: (newFormData: string) => void
  buttonisDisabled: boolean
}) => {
  const { label, handleSubmit, setFormData, buttonisDisabled } = props
  return (
    <div>
      <div style={{ display: 'block', padding: '10px 0 0 10px' }}>
        <Label label={label} />
        <Input
          type={'string'}
          style={{ width: INPUT_FIELD_WIDTH }}
          onChange={(event) => setFormData(event.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Button
          disabled={buttonisDisabled}
          style={edsButtonStyleConfig}
          onClick={() => {
            handleSubmit()
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

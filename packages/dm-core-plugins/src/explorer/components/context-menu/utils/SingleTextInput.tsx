import {Button, Input, Label} from '@equinor/eds-core-react'
import {INPUT_FIELD_WIDTH} from '@development-framework/dm-core'
import React from 'react'
import {edsButtonStyleConfig} from './styles'

export const SingleTextInput = (props: {
  label: string
  handleSubmit: () => void
  setFormData: (newFormData: string) => void
  buttonisDisabled: boolean
}) => {
  const {label, handleSubmit, setFormData, buttonisDisabled} = props
  return (
    <div>
      <div style={{display: 'block'}}>
        <Label label={label}/>
        <Input
          type={'string'}
          style={{width: INPUT_FIELD_WIDTH}}
          onChange={(event: any) => setFormData(event.target.value)}
        />
      </div>
      <div>
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

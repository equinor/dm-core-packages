import { Icon, type TextFieldProps, Tooltip } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
import { Stack } from '../../../common'
import { StyledInputField } from './styles'

type StyledTextFieldProps = {
  isDirty?: boolean
  tooltip?: string
  config?: {
    backgroundColor?: string
  }
}

const StyledEDSField = (props: TextFieldProps & StyledTextFieldProps) => {
  let background =
    props.config?.backgroundColor ?? tokens.colors.ui.background__light.hex

  background =
    props.isDirty && props.variant !== 'error' ? '#85babf5e' : background

  return (
    <StyledInputField
      {...props}
      $background={background}
      disabled={props.readOnly}
      readOnly={false}
      inputIcon={
        <Stack as='span' direction='row' spacing={0.5}>
          <span>{props?.unit}</span>
          {props.tooltip && (
            <Tooltip title={props.tooltip ?? ''}>
              <Icon data={info_circle} size={16} />
            </Tooltip>
          )}
        </Stack>
      }
    ></StyledInputField>
  )
}

export const StyledTextField = (
  props: TextFieldProps & StyledTextFieldProps
) => {
  return (
    <StyledEDSField
      {...props}
      value={
        props.readOnly && props.value === ''
          ? '-'
          : (props.defaultValue ?? props.value)
      }
    />
  )
}

export const StyledNumberField = (
  props: TextFieldProps & StyledTextFieldProps
) => {
  return (
    <StyledEDSField
      {...props}
      value={props.value ?? props.defaultValue}
      type={'number'}
    />
  )
}

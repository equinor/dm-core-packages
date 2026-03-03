import type { TWidget } from '../types'
import { StyledTextArea } from './common/StyledInputFields'

const TextareaWidget = (props: TWidget) => {
  const { label, onChange } = props

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    const formattedValue = value === '' ? null : value
    onChange?.(formattedValue)
  }

  return (
    <StyledTextArea
      {...props}
      rows={5}
      onChange={onChangeHandler}
      data-testid={`form-text-area-widget-${props.label}`}
    />
  )
}

export default TextareaWidget

import { Datepicker } from '../../common/Datepicker'
import { TWidget } from '../types'

interface DatePickerConfig {
  variant: 'datetime' | 'date'
  label?: string
  useMinutes?: boolean
}

const DateTimeWidget = (props: TWidget) => {
  const { label, config, onChange, isDirty, id, value, readOnly, helperText } =
    props

  const conf = config as DatePickerConfig

  return (
    <Datepicker
      id={id}
      variant={conf.variant}
      value={value}
      onChange={onChange}
      data-testid={`form-datetime-widget-${label}`}
      readonly={readOnly}
      label={conf?.label ?? label}
      helperText={helperText}
      isDirty={isDirty}
      useMinutes={conf?.useMinutes}
    />
  )
}

export default DateTimeWidget

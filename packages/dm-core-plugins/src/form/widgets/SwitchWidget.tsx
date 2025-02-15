import { Switch } from '@equinor/eds-core-react'
import type { TWidget } from '../types'

const SwitchWidget = (props: TWidget) => {
  const { value, readOnly } = props

  return (
    <Switch
      {...props}
      disabled={readOnly}
      checked={typeof value === 'undefined' ? false : value}
      data-testid='form-switch'
    />
  )
}

export default SwitchWidget

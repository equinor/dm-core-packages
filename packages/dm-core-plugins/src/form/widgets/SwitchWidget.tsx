import React from 'react'

import { Switch } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const SwitchWidget = (props: TWidget) => {
	const { value, readOnly } = props

	return (
		<Switch
			{...props}
			disabled={readOnly}
			defaultChecked={typeof value === 'undefined' ? false : value}
			data-testid='form-switch'
		/>
	)
}

export default SwitchWidget

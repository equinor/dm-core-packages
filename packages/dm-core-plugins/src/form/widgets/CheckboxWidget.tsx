import React from 'react'

import { Checkbox } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const CheckboxWidget = (props: TWidget) => {
	const { value, readOnly } = props
	return (
		<Checkbox
			{...props}
			disabled={readOnly}
			checked={value !== undefined ? value : false}
			type='checkbox'
			data-testid='form-checkbox'
		/>
	)
}

export default CheckboxWidget

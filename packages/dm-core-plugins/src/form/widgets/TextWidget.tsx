import React from 'react'
import { TextField } from '@equinor/eds-core-react'
import { TWidget } from '../types'

const TextWidget = (props: TWidget) => {
	const { label, onChange, isDirty } = props
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.value === '' ? null : event.target.value)
	}

	return (
		<TextField
			id={props.id}
			readOnly={props.readOnly}
			defaultValue={props.value}
			inputRef={props.inputRef}
			variant={props.variant}
			helperText={props.helperText}
			onChange={onChangeHandler}
			label={label}
			type='string'
			data-testid={`form-text-widget-${props.id}`}
			style={
				isDirty && props.variant !== 'error'
					? {
							// @ts-ignore
							'--eds-input-background': '#85babf5e',
					  }
					: {}
			}
		/>
	)
}

export default TextWidget

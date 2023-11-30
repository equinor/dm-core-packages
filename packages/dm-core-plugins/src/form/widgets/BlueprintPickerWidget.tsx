import * as React from 'react'

import { BlueprintPicker } from '@development-framework/dm-core'
import styled from 'styled-components'
import { TWidget } from '../types'

// The custom widgets goes under here,
// this may at some point be moved out from the form package.
const ErrorHelperText = styled.div`
  color: #b30d2f;
`

const BlueprintPickerWidget = (props: TWidget) => {
	const { label, variant, onChange, value, helperText } = props
	return (
		<>
			<BlueprintPicker
				label={label}
				variant={variant}
				onChange={onChange ?? (() => undefined)}
				formData={value}
			/>
			{variant === 'error' ? (
				<ErrorHelperText>{helperText}</ErrorHelperText>
			) : (
				<></>
			)}
		</>
	)
}

export default BlueprintPickerWidget

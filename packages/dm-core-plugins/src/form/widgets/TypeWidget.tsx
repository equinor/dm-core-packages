import { Loading, useBlueprint } from '@development-framework/dm-core'
import React from 'react'
import { TWidget } from '../types'
import { TextField } from '@equinor/eds-core-react'

const TypeWidget = (props: TWidget) => {
	const { id, label, value } = props
	const { blueprint, isLoading, error } = useBlueprint(value)

	if (isLoading) return <Loading />
	if (error) throw new Error(`Failed to fetch blueprint for '${value}'`)
	if (blueprint === undefined) return <div>Could not find the blueprint</div>

	const datasourceId = value.split('/')[0]

	return (
		<TextField
			id={id}
			label={label}
			readOnly={true}
			value={value}
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onChange={() => {}}
			onClick={() => {
				// @ts-ignore
				window.open(`dmt/view/${datasourceId}/${blueprint.uid}`, '_blank').focus()
			}}
		/>
	)
}

export default TypeWidget

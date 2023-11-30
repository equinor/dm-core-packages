import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
	EntityView,
	resolveRelativeAddress,
	splitAddress,
	useDocument,
} from '@development-framework/dm-core'
import { useRegistryContext } from '../context/RegistryContext'
import { TObjectTemplate } from '../types'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import { OpenObjectButton } from '../components/OpenObjectButton'
import { SelectReference } from '../components/SelectReference'

export const ObjectStorageUncontainedTemplate = (props: TObjectTemplate) => {
	const { namePath, uiRecipe, attribute, uiAttribute } = props
	const { watch, setValue } = useFormContext()
	const { idReference, onOpen } = useRegistryContext()
	const { dataSource, documentPath } = splitAddress(idReference)
	const { config } = useRegistryContext()
	const value = watch(namePath)
	const address = resolveRelativeAddress(value.address, documentPath, dataSource)
	const { document, isLoading } = useDocument<any>(address, 1)

	useEffect(() => {
		if (!isLoading && document) setValue(namePath, document)
	}, [document])

	return (
		<Fieldset>
			<Legend>
				<Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
				{!config.readOnly && (
					<SelectReference
						attributeType={attribute.attributeType}
						namePath={namePath}
					/>
				)}
				{attribute.optional && address && !config.readOnly && (
					<RemoveObject address={address} namePath={namePath} />
				)}
				{address && onOpen && !uiAttribute?.showInline && (
					<OpenObjectButton
						viewId={namePath}
						viewConfig={{
							type: 'ReferenceViewConfig',
							scope: '',
							recipe: uiRecipe?.name,
						}}
						idReference={address}
					/>
				)}
			</Legend>
			{address && !(onOpen && !uiAttribute?.showInline) && (
				<EntityView
					idReference={address}
					type={attribute.attributeType}
					recipeName={uiRecipe?.name}
					onOpen={onOpen}
				/>
			)}
		</Fieldset>
	)
}

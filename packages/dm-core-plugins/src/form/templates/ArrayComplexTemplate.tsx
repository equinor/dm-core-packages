import { TArrayTemplate } from '../types'
import { useFormContext } from 'react-hook-form'
import { useRegistryContext } from '../context/RegistryContext'
import React, { useState } from 'react'
import { EntityView, getKey } from '@development-framework/dm-core'
import { Fieldset, Legend } from '../styles'
import { Typography } from '@equinor/eds-core-react'
import { getDisplayLabel } from '../utils/getDisplayLabel'
import RemoveObject from '../components/RemoveObjectButton'
import AddObject from '../components/AddObjectButton'
import TooltipButton from '../../common/TooltipButton'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { OpenObjectButton } from '../components/OpenObjectButton'

export const ArrayComplexTemplate = (props: TArrayTemplate) => {
	const { namePath, attribute, uiAttribute } = props

	const { getValues, setValue } = useFormContext()
	const { idReference, onOpen, config } = useRegistryContext()
	const [initialValue, setInitialValue] = useState(getValues(namePath))
	const [isExpanded, setIsExpanded] = useState(
		uiAttribute?.showExpanded !== undefined
			? uiAttribute?.showExpanded
			: config.showExpanded
	)
	const uiRecipeName = getKey<string>(uiAttribute, 'uiRecipe', 'string')
	const isDefined = initialValue !== undefined

	return (
		<Fieldset>
			<Legend>
				<Typography bold={true}>{getDisplayLabel(attribute)}</Typography>
				{attribute.optional &&
					!config.readOnly &&
					(isDefined ? (
						<RemoveObject
							namePath={namePath}
							onRemove={() => {
								setInitialValue(undefined)
								setValue(namePath, undefined)
							}}
						/>
					) : (
						<AddObject
							namePath={namePath}
							type={attribute.attributeType}
							defaultValue={[]}
							onAdd={() => setInitialValue([])}
						/>
					))}
				{isDefined && !(onOpen && !uiAttribute?.showInline) && (
					<TooltipButton
						title='Expand'
						button-variant='ghost_icon'
						button-onClick={() => setIsExpanded(!isExpanded)}
						icon={isExpanded ? chevron_up : chevron_down}
					/>
				)}
				{!config.readOnly && isDefined && onOpen && !uiAttribute?.showInline && (
					<OpenObjectButton
						viewId={namePath}
						viewConfig={{
							type: 'ReferenceViewConfig',
							scope: namePath,
							recipe: uiRecipeName,
						}}
					/>
				)}
			</Legend>
			{isDefined && !(onOpen && !uiAttribute?.showInline) && isExpanded && (
				<EntityView
					recipeName={uiRecipeName}
					idReference={`${idReference}.${namePath}`}
					type={attribute.attributeType}
					onOpen={onOpen}
					dimensions={attribute.dimensions}
				/>
			)}
		</Fieldset>
	)
}

import {
	Dialog,
	EBlueprint,
	ErrorResponse,
	INPUT_FIELD_WIDTH,
	TreeNode,
} from '@development-framework/dm-core'
import { Button, Progress, TextField } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { EDialog } from '../../types'
import {
	STANDARD_DIALOG_HEIGHT,
	STANDARD_DIALOG_WIDTH,
} from '../context-menu/NodeRightClickMenu'

type TProps = {
	setDialogId: (id: EDialog | undefined) => void
	node: TreeNode
	setNodeOpen: (x: boolean) => void
}

const NewBlueprintDialog = (props: TProps) => {
	const { setDialogId, node, setNodeOpen } = props
	const [blueprintName, setBlueprintName] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

	const handleCreate = () => {
		setLoading(true)
		node
			.appendEntity(EBlueprint.BLUEPRINT, blueprintName)
			.then(() => {
				setNodeOpen(true)
				toast.success('Blueprint is created')
			})
			.catch((error: AxiosError<ErrorResponse>) => {
				console.error(error)
				toast.error(error.response?.data.message)
			})
			.finally(() => {
				setLoading(false)
				setDialogId(undefined)
			})
	}

	return (
		<Dialog
			open={true}
			isDismissable
			onClose={() => setDialogId(undefined)}
			width={STANDARD_DIALOG_WIDTH}
			height={STANDARD_DIALOG_HEIGHT}
		>
			<Dialog.Header>
				<Dialog.Title>Create new blueprint</Dialog.Title>
			</Dialog.Header>
			<Dialog.CustomContent>
				<TextField
					id='BlueprintName'
					label='Name'
					style={{ width: INPUT_FIELD_WIDTH }}
					value={blueprintName}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						setBlueprintName(event.target.value)
					}
					placeholder='Name for new blueprint'
				/>
			</Dialog.CustomContent>
			<Dialog.Actions>
				<Button disabled={blueprintName === ''} onClick={handleCreate}>
					{loading ? <Progress.Dots /> : 'Create'}
				</Button>
				<Button variant='outlined' onClick={() => setDialogId(undefined)}>
					Cancel
				</Button>
			</Dialog.Actions>
		</Dialog>
	)
}

export default NewBlueprintDialog

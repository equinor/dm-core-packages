import {
  ApplicationContext,
  BlueprintPicker,
  Dialog,
  ErrorResponse,
  TAttribute,
  TBlueprint,
  TreeNode,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Progress, TextField } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
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

const NewEntityDialog = (props: TProps) => {
  const { setDialogId, node, setNodeOpen } = props
  const [blueprintName, setBlueprintName] = useState<string>('')
  const [blueprint, setBlueprint] = useState<TBlueprint>()
  const [newName, setNewName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  const { name } = useContext(ApplicationContext)

  useEffect(() => {
    if (!blueprintName) return
    dmssAPI
      .blueprintGet({ typeRef: blueprintName, context: name })
      .then((response: any) => {
        setBlueprint(response.data.blueprint)
      })
  }, [blueprintName])

  const nameField: TAttribute | undefined = blueprint?.attributes.find(
    (attr: TAttribute) => attr.name === 'name'
  )
  const handleCreate = () => {
    setLoading(true)
    node
      .appendEntity(
        `dmss://${blueprintName}`,
        newName.length > 0 ? newName : undefined
      )
      .then(() => {
        setNodeOpen(true)
        toast.success(`Entity is created`)
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
        <Dialog.Title>Create new entity</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <BlueprintPicker
          label='Blueprint'
          onChange={setBlueprintName}
          formData={blueprintName}
          fieldType={'input-field'}
        />
        {nameField && (
          <TextField
            id={'entity-name'}
            onChange={(e: any) => setNewName(e.target.value)}
            label={'Name'}
            helperText={nameField.optional ? 'Optional' : 'Required'}
          />
        )}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          disabled={
            blueprintName === '' ||
            (nameField && !nameField.optional && !newName)
          }
          onClick={handleCreate}
        >
          {loading ? <Progress.Dots /> : 'Create'}
        </Button>
        <Button variant='outlined' onClick={() => setDialogId(undefined)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default NewEntityDialog

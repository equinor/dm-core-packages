import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { useDMSS } from '../context/DMSSContext'
import { TGenericObject, TReference, TValidEntity } from '../types'
import { INPUT_FIELD_WIDTH } from '../utils/variables'
import { Dialog } from './Dialog'
import {
  BlueprintPicker,
  DestinationPicker,
  EntityPickerButton,
} from './Pickers'

const DialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justifycontent: space-between;
  margin: 20px;

  & > * {
    padding-top: 8px;
  }
`

// TODO fix this component - the component is not working due to a hook error somewhere, probably in the context
export function NewEntityButton(props: {
  type?: string
  onCreated: (r: TReference) => void
  defaultDestination?: string
}) {
  const { type, onCreated, defaultDestination } = props
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>(
    defaultDestination ? defaultDestination : ''
  )

  const [newName, setNewName] = useState<string>('')
  const [documentToCopy, setDocumentToCopy] = useState<
    TGenericObject | undefined
  >(undefined)
  const [typeToCreate, setTypeToCreate] = useState<string>(type || '')
  const [loading, setLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => setTypeToCreate(type || ''), [type])
  useEffect(() => {
    if (defaultDestination) {
      setSaveDestination(defaultDestination)
    }
  }, [defaultDestination])

  function addEntityToPath(entity: TGenericObject) {
    return dmssAPI
      .documentAdd({
        address: saveDestination,
        document: JSON.stringify(entity),
        updateUncontained: false,
      })
      .then((response: AxiosResponse<TGenericObject>) => {
        const idForNewEntity = response.data.uid
        onCreated({
          _id: idForNewEntity,
          type: entity.type,
          name: entity.name,
          ...entity,
        })
      })
      .catch((error: AxiosError) => {
        console.error(error)
        toast.error('Failed to create')
      })
  }

  const onCreateEntity = () => {
    setLoading(true)

    if (documentToCopy) {
      const newDocumentToCopy: TGenericObject = {
        ...documentToCopy,
        name: newName,
      }
      delete newDocumentToCopy._id

      addEntityToPath({ ...newDocumentToCopy })
        .then(() => setShowScrim(false))
        .finally(() => {
          setDocumentToCopy(undefined)
          setNewName('')
          setLoading(false)
        })
    } else {
      dmssAPI
        .instantiateEntity({
          entity: {
            type: typeToCreate,
          },
        })
        .then((response) => {
          const newEntity = response.data
          // instantiateEntity from DMSS will not populate the name, therefore the name has to be added manually.

          addEntityToPath({
            ...newEntity,
            name: newName as string,
          }).then(() => setShowScrim(false))
        })
        .finally(() => {
          setLoading(false)
          setDocumentToCopy(undefined)
          setNewName('')
        })
    }
  }

  return (
    <div style={{ margin: '0 10px' }}>
      <Button onClick={() => setShowScrim(true)}>New</Button>
      <Dialog
        isOpen={showScrim}
        closeScrim={() => setShowScrim(false)}
        header={`Create new entity`}
        width={'600px'}
        height={'370px'}
      >
        <DialogWrapper>
          {!type && (
            <div style={{ display: 'block' }}>
              <BlueprintPicker
                label={'Blueprint'}
                disabled={!!documentToCopy}
                onChange={(selectedType: string) =>
                  setTypeToCreate(selectedType)
                }
                formData={typeToCreate}
              />
            </div>
          )}

          {!defaultDestination && (
            <div>
              <DestinationPicker
                label={'Entity destination folder'}
                onChange={(selectedFolder: string) =>
                  setSaveDestination(selectedFolder)
                }
                formData={saveDestination}
              />
            </div>
          )}
          <Label label={'Name'} />
          <Input
            style={{
              width: INPUT_FIELD_WIDTH,
              cursor: 'text',
            }}
            type="string"
            value={newName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewName(event.target.value)
            }
            placeholder="Name for new entity"
          />
          {!!documentToCopy && (
            <div>{`Copying entity named '${documentToCopy.name}'`}</div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: '40px',
            }}
          >
            {!documentToCopy ? (
              <EntityPickerButton
                buttonVariant="outlined"
                typeFilter={typeToCreate}
                alternativeButtonText="Copy existing"
                onChange={(address: string, entity?: TValidEntity) =>
                  setDocumentToCopy(entity)
                }
              />
            ) : (
              <Button
                onClick={() => setDocumentToCopy(undefined)}
                variant="outlined"
                color="danger"
              >
                Don't copy
              </Button>
            )}
            <Button
              disabled={
                !(
                  newName &&
                  saveDestination &&
                  (typeToCreate || documentToCopy)
                )
              }
              type="submit"
              onClick={onCreateEntity}
            >
              {loading ? <Progress.Dots /> : 'Create'}
            </Button>
          </div>
        </DialogWrapper>
      </Dialog>
    </div>
  )
}

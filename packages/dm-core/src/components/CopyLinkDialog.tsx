import { Button, Checkbox, Label, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import { ChangeEvent, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import {
  AuthContext,
  Dialog,
  EBlueprint,
  EntityPickerDialog,
  ErrorResponse,
  TEntityPickerReturn,
  TLinkReference,
  TValidEntity,
  useDMSS,
  useDocument,
} from '../index'
import { setMetaInDocument } from '../utils/setMetaInDocument'

type TProps = {
  idReference: string
  open: boolean
  setOpen: (v: boolean) => void
  mode?: 'copy' | 'link'
  title?: string
  buttonText?: string
  destination?: string
  hideProvidedFields?: boolean
}

export const CopyLinkDialog = (props: TProps) => {
  const {
    idReference,
    mode,
    destination,
    open,
    setOpen,
    hideProvidedFields,
    title,
    buttonText,
  } = props
  const { tokenData } = useContext(AuthContext)

  const username =
    tokenData?.preferred_username || tokenData?.name || 'Anonymous'

  const [selectedDestination, setSelectedDestination] =
    useState<TEntityPickerReturn>({
      address: destination || '',
      path: destination || '',
      entity: { type: '' },
    })
  const [selectedMode, setSelectedMode] = useState<'copy' | 'link'>(
    mode || 'copy'
  )
  const [showDestinationDialog, setShowDestinationDialog] =
    useState<boolean>(false)
  const { document, isLoading: documentIsLoading } = useDocument<TValidEntity>(
    idReference,
    9
  )

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dmss = useDMSS()

  const copyEntityToDestination = () => {
    if (!selectedDestination) return
    setIsLoading(true)
    let newDocument = window.structuredClone(document) as TValidEntity
    // @ts-ignore
    newDocument['_id'] = undefined // Remove any old ID, or we will get into trouble

    newDocument._meta_ = newDocument?._meta_ || {
      type: EBlueprint.META,
      version: '0.0.1',
      dependencies: [],
      createdBy: username,
      createdTimestamp: new Date().toISOString(),
    }

    newDocument = setMetaInDocument(newDocument, username)

    dmss
      .documentAdd({
        address: selectedDestination.address,
        document: JSON.stringify(newDocument),
      })
      .then(() => {
        toast.success(`Entity copied to '${selectedDestination.path}'`)
        setOpen(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .finally(() => setIsLoading(false))
  }

  const insertLinkAtDestination = () => {
    if (!selectedDestination) return
    setIsLoading(true)
    const linkReference: TLinkReference = {
      address: idReference,
      referenceType: 'link',
      type: EBlueprint.REFERENCE,
    }
    dmss
      .documentAdd({
        address: selectedDestination.address,
        document: JSON.stringify(linkReference),
      })
      .then(() => {
        toast.success(`Entity linked to '${selectedDestination.path}'`)
        setOpen(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Dialog open={open} width={'100%'}>
      <Dialog.Header>
        <Dialog.Title>{title || 'Copy or link entity'}</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        <EntityPickerDialog
          title={`Select destination for ${selectedMode}`}
          showModal={showDestinationDialog}
          setShowModal={setShowDestinationDialog}
          onChange={(v: TEntityPickerReturn) => {
            setSelectedDestination(v)
          }}
        />
        {(!destination || !hideProvidedFields) && (
          <div className={'flex justify-between align-center'}>
            <div className={'flex items-center'}>
              <Label label='Destination:' />
              <p>{selectedDestination.path || '-'}</p>
            </div>
            <Button onClick={() => setShowDestinationDialog(true)}>
              Browse
            </Button>
          </div>
        )}
        {(!mode || !hideProvidedFields) && (
          <Checkbox
            label='Copy as link'
            checked={selectedMode === 'link'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSelectedMode(e.target.checked ? 'link' : 'copy')
            }
          />
        )}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <div className={'flex justify-around w-full'}>
          <Button
            variant='outlined'
            color='danger'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedDestination.address}
            onClick={() => {
              if (selectedMode === 'copy') {
                copyEntityToDestination()
              } else {
                insertLinkAtDestination()
              }
            }}
          >
            {buttonText ||
              (isLoading ? (
                <Progress.Dots />
              ) : selectedMode === 'copy' ? (
                'Copy'
              ) : (
                'Insert link'
              ))}
          </Button>
        </div>
      </Dialog.Actions>
    </Dialog>
  )
}

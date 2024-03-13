import {
  AuthContext,
  Dialog,
  EBlueprint,
  EntityPickerDialog,
  ErrorResponse,
  TEntityPickerReturn,
  TLinkReference,
  TValidEntity,
  truncatePathString,
  useApplication,
  useDocument,
} from '@development-framework/dm-core'
import {
  Button,
  Icon,
  Label,
  Progress,
  Radio,
  TextField,
  Tooltip,
} from '@equinor/eds-core-react'
import { folder_open } from '@equinor/eds-icons'
import { AxiosError } from 'axios'
import { ChangeEvent, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { setMetaInDocument } from './utils'

type TPropsBase = {
  idReference: string
  open: boolean
  setOpen: (v: boolean) => void
  mode?: 'copy' | 'link' | 'copy&link'
  title?: string
  buttonText?: string
  destination?: string
  description?: string
  linkTarget?: string
  hideProvidedFields?: boolean
}

type TProps =
  | (TPropsBase & { wrapper?: undefined; wrapperAttribute?: undefined })
  | (TPropsBase & {
      wrapper: string
      wrapperAttribute: string
    })

export const CopyLinkDialog = (props: TProps) => {
  const {
    idReference,
    mode,
    destination,
    description,
    linkTarget,
    open,
    setOpen,
    hideProvidedFields,
    title,
    buttonText,
    wrapper,
    wrapperAttribute,
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
  const [selectedLinkTarget, setLinkTarget] = useState<TEntityPickerReturn>({
    address: linkTarget || '',
    path: linkTarget || '',
    entity: { type: '' },
  })
  const [selectedMode, setSelectedMode] = useState<
    'copy' | 'link' | 'copy&link'
  >(mode || 'copy')
  const [note, setNote] = useState<string>('')
  const [showDestinationDialog, setShowDestinationDialog] =
    useState<boolean>(false)
  const [showLinkTargetDialog, setShowLinkTargetDialog] =
    useState<boolean>(false)
  const { document } = useDocument<TValidEntity>(idReference, 9)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dmssAPI } = useApplication()

  const copyEntityToDestination = async (): Promise<
    Promise<TEntityPickerReturn> | Promise<void>
  > => {
    setIsLoading(true)
    let newDocument = window.structuredClone(document) as TValidEntity

    delete newDocument['_id'] // Remove any old ID, or we will get into trouble

    newDocument._meta_ = newDocument?._meta_ || {
      type: EBlueprint.META,
      version: '0.0.1',
      versionNote: note,
      dependencies: [],
      createdBy: username,
      createdTimestamp: new Date().toISOString(),
    }

    newDocument = setMetaInDocument(newDocument, username)

    if (wrapper) {
      const wrapperEntity: TValidEntity =
        // TODO: Handle relative/unresolved addresses? Perhaps in blueprint upload?
        (await dmssAPI.instantiateEntity({ entity: { type: wrapper } }))
          .data as TValidEntity
      wrapperEntity[wrapperAttribute] = newDocument
      wrapperEntity._meta_ = newDocument._meta_
      newDocument = wrapperEntity
    }

    return dmssAPI
      .documentAdd({
        address: selectedDestination.address,
        document: JSON.stringify(newDocument),
      })
      .then((response) => {
        toast.success(`Entity copied to '${selectedDestination.path}'`)
        const newCopyAddress = (response.data as { uid: string }).uid
        return {
          address: newCopyAddress,
          path: newCopyAddress,
          entity: { type: '' },
        } as TEntityPickerReturn
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .finally(() => {
        setOpen(false)
        setIsLoading(false)
      })
  }

  const insertLinkAtDestination = (target: TEntityPickerReturn) => {
    setIsLoading(true)
    const linkReference: TLinkReference = {
      address: target.address,
      referenceType: 'link',
      type: EBlueprint.REFERENCE,
    }
    dmssAPI
      .documentAdd({
        address: selectedLinkTarget.address,
        document: JSON.stringify(linkReference),
      })
      .then(() => {
        toast.success(`Entity linked to '${selectedLinkTarget.path}'`)
        setOpen(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .finally(() => setIsLoading(false))
  }

  const copyAndLink = async () => {
    const newCopy = (await copyEntityToDestination()) || null
    if (!newCopy) return
    insertLinkAtDestination(newCopy)
  }

  return (
    <Dialog
      open={open}
      style={{ minWidth: '450px', width: '40vw', maxWidth: '600px' }}
    >
      <Dialog.Header>
        <Dialog.Title>{title || 'Copy or link entity'}</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent>
        {description && <p className='mb-4'>{description}</p>}
        <TextField
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNote(e.target.value)
          }
          id='textfield-normal'
          placeholder='Note on published version'
          label='Note'
          autoComplete='off'
        />
        {(!destination || !hideProvidedFields) && (
          <div className={'flex justify-between align-center py-2'}>
            <div className={'flex items-center'}>
              <Label label='Destination:' />
              <p>{truncatePathString(selectedDestination.path || '-')}</p>
            </div>
            <Button
              variant='ghost_icon'
              aria-label='browse destination action'
              onClick={() => setShowDestinationDialog(true)}
            >
              <Icon data={folder_open}></Icon>
            </Button>
          </div>
        )}
        {(!linkTarget || !hideProvidedFields) &&
          selectedMode === 'copy&link' && (
            <div className={'flex justify-between align-center py-2'}>
              <div className={'flex items-center'}>
                <Label label='Link target:' />
                <p>{truncatePathString(selectedLinkTarget.path || '-')}</p>
              </div>
              <Button
                variant='ghost_icon'
                aria-label='browse link action'
                onClick={() => setShowLinkTargetDialog(true)}
              >
                <Icon data={folder_open}></Icon>
              </Button>
            </div>
          )}
        {(!mode || !hideProvidedFields) && (
          <fieldset>
            <legend>Publish mode</legend>
            <Tooltip title='Make a copy at the destination'>
              <Radio
                label='Copy'
                name='group'
                value='copy'
                checked={selectedMode === 'copy'}
                onChange={() => setSelectedMode('copy')}
              />
            </Tooltip>
            <Tooltip title='Insert a link at destination'>
              <Radio
                label='Link'
                name='group'
                value='link'
                checked={selectedMode === 'link'}
                onChange={() => setSelectedMode('link')}
              />
            </Tooltip>
            <Tooltip title='Make a copy at destination, and insert a link at link target'>
              <Radio
                label='Copy & Link'
                name='group'
                value='copy&link'
                checked={selectedMode === 'copy&link'}
                onChange={() => setSelectedMode('copy&link')}
              />
            </Tooltip>
          </fieldset>
        )}
        <EntityPickerDialog
          title={`Select destination for the copy`}
          showModal={showDestinationDialog}
          setShowModal={setShowDestinationDialog}
          onChange={(v: TEntityPickerReturn) => {
            setSelectedDestination(v)
          }}
        />
        <EntityPickerDialog
          title={`Select target to insert link`}
          showModal={showLinkTargetDialog}
          setShowModal={setShowLinkTargetDialog}
          onChange={(v: TEntityPickerReturn) => {
            setLinkTarget(v)
          }}
        />
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
              }
              if (selectedMode === 'link') {
                insertLinkAtDestination(selectedDestination)
              } else {
                copyAndLink()
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

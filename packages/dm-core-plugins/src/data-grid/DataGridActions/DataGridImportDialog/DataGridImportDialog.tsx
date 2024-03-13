import {
  Button,
  Dialog,
  Radio,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
import { useState } from 'react'
import { Message, Skeleton, Stack } from '../../../common'
import { DataGridImportDialogProps } from './types'
import { checkAndParseToAttributeType, checkDimensions } from './utils'

export function DataGridImportDialog(props: DataGridImportDialogProps) {
  const {
    dimensions,
    attributeType,
    setData,
    data,
    updateColumnLabels,
    updateRowLabels,
  } = props
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])
  const [successfullyPasted, setSuccessfullyPasted] = useState<boolean>(false)
  const [dataPlacementAction, setDataPlacementAction] = useState<
    'replace' | 'add'
  >('replace')

  const [definedColumns, definedRows] = (dimensions || '*,*').split(',')
  const isMultiDimensional = dimensions?.includes(',') || false
  const canAddRows = isMultiDimensional
    ? definedRows === '*'
    : definedColumns === '*'

  async function handleUpload(parsedValue: any[]) {
    setErrors([])
    setSuccessfullyPasted(false)

    // checks and validation
    const dimensionErrors = await checkDimensions(parsedValue, dimensions)
    const [parsedData, attributeTypeErrors] =
      await checkAndParseToAttributeType(
        parsedValue,
        attributeType,
        isMultiDimensional
      )
    const errors = [...dimensionErrors, ...attributeTypeErrors]
    if (errors.length > 0) {
      setErrors(errors)
      setIsLoading(false)
      return
    }

    const updatedData =
      dataPlacementAction === 'add' && canAddRows
        ? [...data, ...parsedData]
        : parsedData

    if (isMultiDimensional) {
      updateColumnLabels(updatedData[0].length)
    }
    updateRowLabels(updatedData.length)
    setData(updatedData)
    setIsLoading(false)
    setSuccessfullyPasted(true)
  }

  async function importFromClipboard(event: any) {
    event.preventDefault()
    setIsLoading(true)
    const value = event.clipboardData.getData('text')
    const parsedValue = value?.split('\n').map((t: string) => t.split('\t'))
    handleUpload(parsedValue)
  }

  async function importFromFileUpload(event: any) {
    event.preventDefault()
    setIsLoading(true)
    const reader = new FileReader()
    reader.onloadend = (readerEvent) => {
      const text = readerEvent.target?.result
      const separators = new RegExp(/;|\t/)
      const parsedValue = String(text)
        ?.split('\n')
        .map((t: string) => t.split(separators))
      handleUpload(parsedValue)
    }
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      reader.readAsText(file)
    }
  }

  function onClose() {
    props.closeModal()
    setSuccessfullyPasted(false)
    setErrors([])
  }

  return (
    <Dialog
      isDismissable
      onClose={onClose}
      open={props.open}
      style={{ minWidth: '30vw' }}
    >
      <Stack padding={1.5} spacing={1}>
        <Typography variant='h4'>Import data</Typography>
        {canAddRows && (
          <Stack>
            <Typography className='pl-2' group='input' variant='label'>
              Data action
            </Typography>
            <Stack role='radiogroup' direction='row' spacing={1}>
              <Radio
                label={'Replace already existing data'}
                value={'replace'}
                checked={dataPlacementAction === 'replace'}
                onChange={() => setDataPlacementAction('replace')}
              />
              <Radio
                label={'Add data to bottom of existing data'}
                value={'add'}
                checked={dataPlacementAction === 'add'}
                onChange={() => setDataPlacementAction('add')}
              />
            </Stack>
          </Stack>
        )}
        <Stack spacing={1}>
          <Stack direction='row' spacing={1}>
            {isLoading ? (
              <Skeleton height='33px' />
            ) : (
              <>
                <TextField
                  label='Paste data'
                  id='paste'
                  autoFocus
                  placeholder='Ctrl+v / Cmd+v'
                  onPaste={importFromClipboard}
                />

                <TextField
                  id='Upload data'
                  label='Or upload .csv file'
                  type='file'
                  onChange={importFromFileUpload}
                  accept='.csv'
                />
              </>
            )}
          </Stack>
          {errors.length > 0 && (
            <Message type='error' onDismiss={() => setErrors([])}>
              <Typography bold>
                Data validation failed. Please fix these issues before trying to
                import again
              </Typography>
              <ul>
                {errors.map((error, index) => (
                  <li key={`import-data-error-${index}`}>- {error}</li>
                ))}
              </ul>
            </Message>
          )}
          {successfullyPasted && (
            <Message
              type='success'
              onDismiss={() => setSuccessfullyPasted(false)}
            >
              Data was successfully pasted and added to table!
            </Message>
          )}
          <Stack alignItems='flex-end'>
            <Button variant='outlined' onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}

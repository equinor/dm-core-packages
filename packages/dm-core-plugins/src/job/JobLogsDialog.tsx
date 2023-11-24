import {
  Dialog,
  ErrorResponse,
  GetJobResultResponse,
} from '@development-framework/dm-core'
import { Button } from '@equinor/eds-core-react'
import React from 'react'
import { LogBlock } from './LogBlock'

type AboutDialogProps = {
  isOpen: boolean
  setIsOpen: (newValue: boolean) => void
  logs: string[]
  error: ErrorResponse | undefined
  result: GetJobResultResponse | null
}

export const JobLogsDialog = (props: AboutDialogProps) => {
  const { isOpen, setIsOpen, logs, error, result } = props

  return (
    <Dialog
      isDismissable
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width={'60vw'}
      style={{ maxHeight: '70vh' }}
    >
      <Dialog.CustomContent style={{ overflow: 'auto' }}>
        <LogBlock
          title={error ? 'Error' : 'Logs'}
          content={error ? error : logs}
        />
        {result && <LogBlock title="Result" content={result} />}
      </Dialog.CustomContent>
      <Dialog.Actions
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}
      >
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

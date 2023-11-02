import {
  Dialog,
  ErrorResponse,
  GetJobResultResponse,
} from '@development-framework/dm-core'
import { Button, Typography } from '@equinor/eds-core-react'
import React from 'react'
import hljs from 'highlight.js'
import { FormattedLogContainer } from './JobPlugin'

type AboutDialogProps = {
  isOpen: boolean
  setIsOpen: (newValue: boolean) => void
  logs: string
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
      height={'70vh'}
    >
      <Dialog.Header>
        <Dialog.Title>Job logs</Dialog.Title>
      </Dialog.Header>
      <Dialog.CustomContent style={{ overflow: 'auto' }}>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="h6" style={{ paddingBottom: '.4rem' }}>
              Logs:
            </Typography>
          </div>
          <FormattedLogContainer style={{ height: '25rem' }}>
            <code
              dangerouslySetInnerHTML={
                error
                  ? {
                      __html: hljs.highlight(JSON.stringify(error, null, 2), {
                        language: 'json',
                      }).value,
                    }
                  : {
                      __html: hljs.highlightAuto(logs).value,
                    }
              }
            />
          </FormattedLogContainer>
        </div>
        {result && (
          <div>
            <Typography variant="h6" style={{ paddingBottom: '.4rem' }}>
              Result:
            </Typography>
            <FormattedLogContainer style={{ height: '25rem' }}>
              <code
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(JSON.stringify(result), {
                    language: 'json',
                  }).value,
                }}
              />
            </FormattedLogContainer>
          </div>
        )}
      </Dialog.CustomContent>
      <Dialog.Actions
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}
      >
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

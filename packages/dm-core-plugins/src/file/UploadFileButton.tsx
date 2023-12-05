import { TStorageReference, useDMSS } from '@development-framework/dm-core'
import { Button, Progress } from '@equinor/eds-core-react'
import { AxiosError } from 'axios'
import * as React from 'react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ErrorGroup } from './ErrorGroup'

export interface UploadButtonProps {
  dataSourceId: string
  onUpload: (file: File, reference: TStorageReference) => void
}

export const UploadFileButton = (props: UploadButtonProps) => {
  const { onUpload, dataSourceId } = props
  const textInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const dmssAPI = useDMSS()

  useEffect(() => setError(undefined))

  function handleUpload(event: any): void {
    setError('')
    const file = event.target.files[0]
    setLoading(true)
    const blobId = crypto.randomUUID()
    dmssAPI
      .blobUpload({
        dataSourceId: dataSourceId,
        file: file,
        blobId: blobId,
      })
      .then(() => {
        const reference: TStorageReference = {
          referenceType: 'storage',
          address: `$${blobId}`,
          type: 'dmss://system/SIMOS/Reference',
        }
        onUpload(file, reference)
      })
      .catch((error: AxiosError<any>) => {
        console.log(error)
        const errorResponse =
          typeof error.response?.data === 'object'
            ? error.response?.data?.message
            : error.response?.data
        const errorMessage = errorResponse || 'Failed to upload file'
        setError(errorMessage)
      })
      .finally(() => setLoading(false))
  }

  if (error)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed uploading file...
          <div>
            <code>{error}</code>
          </div>
        </b>
      </ErrorGroup>
    )

  return (
    <>
      <input
        type='file'
        ref={textInput}
        style={{ display: 'none' }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleUpload(event)}
      />
      {loading ? (
        <Button style={{ margin: '0 10px' }}>
          <Progress.Dots />
        </Button>
      ) : (
        <Button
          onClick={() => textInput?.current?.click()}
          style={{ margin: '0 10px' }}
        >
          Upload
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}

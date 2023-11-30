import { useEffect, useState } from 'react'
import {
  ErrorResponse,
  Loading,
  TFileEntity,
  useDMSS,
} from '@development-framework/dm-core'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Button } from '@equinor/eds-core-react'
import * as React from 'react'
import { ErrorGroup } from './ErrorGroup'

export interface DownloadButtonProps {
  dataSourceId: string
  fileEntity: TFileEntity
}

export const DownloadFileButton = (props: DownloadButtonProps) => {
  const { fileEntity, dataSourceId } = props
  const [fileUrl, setFileUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const dmssAPI = useDMSS()

  useEffect(() => {
    setError(null)
    const options: AxiosRequestConfig = {
      responseType: 'blob',
    }
    dmssAPI
      .blobGetById(
        {
          dataSourceId: dataSourceId,
          blobId: fileEntity.content?.address ?? 'None',
        },
        options
      )
      .then((response: AxiosResponse) => {
        const data = response.data
        const blob = new Blob([data], { type: fileEntity['filetype'] })
        setFileUrl(window.URL.createObjectURL(blob))
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setError(error.response?.data.message || 'Failed to fetch file')
      })
      .finally(() => setLoading(false))
  }, [fileEntity])

  if (error)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed to load file...
          <div>
            <code>{error}</code>
          </div>
        </b>
      </ErrorGroup>
    )

  if (loading) return <Loading />

  return (
    <div style={{ padding: '10px' }}>
      <Button
        href={fileUrl}
        rel='noopener noreferrer'
        download={fileEntity['name']}
      >
        Download
      </Button>
    </div>
  )
}

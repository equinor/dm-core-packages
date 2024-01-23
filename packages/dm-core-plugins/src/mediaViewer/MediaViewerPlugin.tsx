import {
  EBlueprint,
  ErrorResponse,
  IUIPlugin,
  Loading,
  MediaContent,
  mimeTypes,
  splitAddress,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { AxiosError, AxiosRequestConfig } from 'axios'
import React, { Suspense, useEffect, useState } from 'react'

interface MediaObject {
  type: string
  _id: string
  name: string
  author: string
  date: string
  size: number
  filetype: string
  content: {
    type: string
    referenceType: string
    address: string
  }
}

interface MediaViewerConfig {
  type: string
  width?: number
  height?: number
}

export const MediaViewerPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: MediaViewerConfig }
): React.ReactElement => {
  const { idReference, config } = props
  const [blobUrl, setBlobUrl] = useState<string>()
  const dmssAPI = useDMSS()
  const {
    document,
    isLoading,
    error: documentError,
  } = useDocument<MediaObject>(idReference, 1)
  const { dataSource } = splitAddress(idReference)
  const options: AxiosRequestConfig = { responseType: 'blob' }
  useEffect(() => {
    if (document?.content?.address)
      dmssAPI
        .blobGetById(
          {
            dataSourceId: dataSource,
            blobId: document?.content?.address.slice(1),
          },
          options
        )
        .then((response: any) => {
          const blob = new Blob([response.data], {
            type: mimeTypes[document.filetype] || 'application/octet-stream',
          })
          setBlobUrl(window.URL.createObjectURL(blob))
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error)
        })
  }, [document])

  if (documentError) throw new Error(JSON.stringify(documentError, null, 2))
  if (isLoading || document === null) return <Loading />
  if (document.type !== EBlueprint.FILE) throw new Error('This is not a file')
  return (
    <Suspense fallback={<Loading />}>
      {
        blobUrl ? (
          <MediaContent
            blobUrl={blobUrl}
            config={config}
            meta={{
              author: document.author,
              fileSize: document.size,
              title: document.name,
              filetype: document.filetype,
              date: document.date,
            }}
          />
        ) : (
          <Loading />
        ) // Downloading blob...
      }
    </Suspense>
  )
}

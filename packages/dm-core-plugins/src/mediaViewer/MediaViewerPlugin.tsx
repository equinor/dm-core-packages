import React, { ReactElement, useEffect, useState } from 'react'
import {
  EBlueprint,
  ErrorResponse,
  IUIPlugin,
  Loading,
  splitAddress,
  useDMSS,
  useDocument,
} from '@development-framework/dm-core'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { MediaContent } from './MediaContent'

interface MediaObject {
  type: string
  name: string
  description: string
  data: {
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
}

export function MediaViewerPlugin(props: IUIPlugin): ReactElement {
  const { idReference } = props
  const [blobUrl, setBlobUrl] = useState<string>()
  const dmssAPI = useDMSS()
  const {
    document,
    isLoading,
    error: documentError,
  } = useDocument<MediaObject>(idReference, 999)
  const { dataSource } = splitAddress(idReference)
  const options: AxiosRequestConfig = { responseType: 'blob' }
  useEffect(() => {
    if (document?.data.content?.address)
      dmssAPI
        .blobGetById(
          {
            dataSourceId: dataSource,
            blobId: document?.data.content?.address.slice(1),
          },
          options
        )
        .then((response: any) => {
          const blob = new Blob([response.data], {
            type: document.data.filetype,
          })
          setBlobUrl(window.URL.createObjectURL(blob))
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error)
        })
  }, [document])

  if (documentError) throw new Error(JSON.stringify(documentError, null, 2))
  if (isLoading || document === null) return <Loading />
  if (document.data.type !== EBlueprint.FILE) return <>Error: Not File type</>
  return (
    <>
      {blobUrl ? (
        <MediaContent
          blobUrl={blobUrl}
          meta={{
            author: document.data.author,
            fileSize: document.data.size,
            title: document.data.name,
            filetype: document.data.filetype,
            date: document.data.date,
          }}
        />
      ) : (
        <p>Media not found</p>
      )}
    </>
  )
}

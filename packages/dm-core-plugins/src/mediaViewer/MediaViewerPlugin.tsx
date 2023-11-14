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
import { Button } from '@equinor/eds-core-react'

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
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3>{document.name}</h3>
        <Button variant="ghost">Download</Button>
      </div>

      {['image/jpeg', 'image/gif'].includes(document.data.filetype) ? (
        <img
          src={blobUrl}
          style={{ height: `${window.screen.height * 0.8}px` }}
        />
      ) : document.data.filetype.includes('video') ? (
        <video src={blobUrl} style={{ width: '60%' }} controls />
      ) : (
        <iframe
          src={blobUrl}
          style={{ width: '100%', height: `${window.screen.height * 0.8}px` }}
        />
      )}
    </div>
  )
}

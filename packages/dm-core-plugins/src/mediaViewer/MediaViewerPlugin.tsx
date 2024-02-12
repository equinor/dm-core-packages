import {
  EBlueprint,
  IUIPlugin,
  Loading,
  MediaContent,
  imageFiletypes,
  mimeTypes,
  splitAddress,
  useDMSS,
  useDocument,
  videoFiletypes,
} from '@development-framework/dm-core'
import { AxiosRequestConfig } from 'axios'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

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

  const getBlobUrl = useCallback(async () => {
    if (document?.content?.address) {
      try {
        const response = await dmssAPI.blobGetById(
          {
            dataSourceId: dataSource,
            blobId: document?.content?.address.slice(1),
          },
          options
        )
        const blob = new Blob([response.data], {
          type: mimeTypes[document.filetype] || 'application/octet-stream',
        })
        const url = window.URL.createObjectURL(blob)
        setBlobUrl(url)
        return url
      } catch (error) {
        console.error(error)
      }
    }
    return ''
  }, [document?.content])

  useEffect(() => {
    if (document) {
      const { filetype } = document as MediaObject
      // Only fetch file types we have previews for
      if (
        imageFiletypes.includes(filetype) ||
        videoFiletypes.includes(filetype) ||
        filetype === 'pdf'
      ) {
        getBlobUrl()
      }
    }
  }, [document])

  if (documentError) throw new Error(JSON.stringify(documentError, null, 2))
  if (isLoading || document === null) return <Loading />
  if (document.type !== EBlueprint.FILE) throw new Error('This is not a file')
  return (
    <Suspense fallback={<Loading />}>
      <MediaContent
        blobUrl={blobUrl}
        getBlobUrl={getBlobUrl}
        config={config}
        meta={{
          author: document.author,
          fileSize: document.size,
          title: document.name,
          filetype: document.filetype,
          date: document.date,
        }}
      />
    </Suspense>
  )
}

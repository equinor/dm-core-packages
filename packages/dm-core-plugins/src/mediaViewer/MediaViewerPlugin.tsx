import {
  EBlueprint,
  type IUIPlugin,
  Loading,
  splitAddress,
  useApplication,
  useDocument,
} from '@development-framework/dm-core'
import type { AxiosRequestConfig } from 'axios'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { MediaContent } from './MediaContent/MediaContent'
import { mimeTypes } from './mime-types'

interface MediaObject {
  type: string
  _id: string
  name: string
  author: string
  date: string
  size: number
  filetype: string
  contentType?: string
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
  const [contentType, setContentType] = useState<string>('')
  const { dmssAPI } = useApplication()
  const {
    document,
    isLoading,
    error: documentError,
  } = useDocument<MediaObject>(idReference, 1)
  const { dataSource } = splitAddress(idReference)
  const options: AxiosRequestConfig = { responseType: 'blob' }

  const getBlobUrl = useCallback(
    async (passedContentType?: string) => {
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
            type: passedContentType || contentType,
          })
          const url = window.URL.createObjectURL(blob)
          setBlobUrl(url)
          return url
        } catch (error) {
          console.error(error)
        }
      }
      return ''
    },
    [document?.content]
  )

  useEffect(() => {
    if (document) {
      const contentType =
        document?.contentType ||
        mimeTypes[document.filetype] ||
        'application/octet-stream'
      setContentType(contentType)
      // Only fetch file types we have previews for
      if (
        contentType.includes('image') ||
        contentType.includes('video') ||
        contentType === 'application/pdf'
      ) {
        getBlobUrl(contentType)
      }
    }
  }, [document])

  if (documentError) throw new Error(JSON.stringify(documentError, null, 2))
  if (isLoading || document === null) return <Loading />
  if (document.type !== EBlueprint.FILE) throw new Error('This is not a file')
  return (
    <div className='dm-plugin-padding'>
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
            contentType,
          }}
        />
      </Suspense>
    </div>
  )
}

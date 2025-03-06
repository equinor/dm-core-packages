import {
  EBlueprint,
  type IUIPlugin,
  Loading,
  splitAddress,
  useApplication,
  useDocument,
} from '@development-framework/dm-core'
import type { AxiosRequestConfig } from 'axios'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Stack } from '../common'
import { createSyntheticFileDownload } from '../utils'
import { MediaContent } from './MediaContent/MediaContent'
import { MediaPluginWrapper } from './MediaContent/styles'
import type {
  MediaObject,
  MediaViewerPluginConfig,
} from './MediaViewerPlugin.types'
import { mimeTypes } from './mime-types'

export const MediaViewerPlugin = (
  props: Omit<IUIPlugin, 'config'> & { config: MediaViewerPluginConfig }
) => {
  const { idReference, config } = props
  const [blobUrl, setBlobUrl] = useState<string>()
  const { dmssAPI } = useApplication()
  const { document, isLoading, error } = useDocument<MediaObject>(
    idReference,
    1
  )
  const { dataSource } = useMemo(() => splitAddress(idReference), [idReference])
  const [contentType, canPreview] = useMemo(() => {
    const contentType =
      document?.contentType || document?.filetype
        ? mimeTypes[document.filetype]
        : 'application/octet-stream'
    const canPreview =
      contentType.includes('image') ||
      contentType.includes('video') ||
      contentType === 'application/pdf'
    return [contentType, canPreview]
  }, [document])

  const fetchBlob = useCallback(async () => {
    if (document?.content?.address) {
      try {
        const response = await dmssAPI.blobGetById(
          {
            dataSourceId: dataSource,
            blobId: document?.content?.address.slice(1),
          },
          { responseType: 'blob' }
        )
        const blobFile = new Blob([response.data], {
          type: contentType,
        })
        const syntheticBlobUrl = window.URL.createObjectURL(blobFile)
        setBlobUrl(syntheticBlobUrl)
        return syntheticBlobUrl
      } catch (error) {
        console.error(error)
      }
    }
    return ''
  }, [document])

  useEffect(() => {
    if (canPreview) {
      fetchBlob()
    }
  }, [canPreview])

  async function downloadFile() {
    const url = blobUrl || (await fetchBlob())
    createSyntheticFileDownload(url, `${document?.name}.${document?.filetype}`)
  }

  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (isLoading || document === null) return <Loading />
  if (document.type !== EBlueprint.FILE) throw new Error('This is not a file')

  return (
    <MediaPluginWrapper
      className='dm-plugin-padding'
      $fill={config.fill}
      $height={config.height}
      $width={config.width}
    >
      <Suspense fallback={<Loading />}>
        <MediaContent
          blobUrl={blobUrl}
          downloadFile={downloadFile}
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
    </MediaPluginWrapper>
  )
}

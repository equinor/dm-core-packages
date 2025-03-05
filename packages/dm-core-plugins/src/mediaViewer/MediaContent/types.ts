import type { MediaViewerPluginConfig } from '../MediaViewerPlugin.types'

export interface MediaContentProps {
  blobUrl: string | undefined
  downloadFile: () => void
  config: MediaViewerPluginConfig
  meta: {
    author: string
    fileSize: number
    title?: string
    date: string
    filetype: string
    contentType?: string
  }
}

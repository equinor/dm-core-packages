export interface MediaContentConfig {
  height?: number
  width?: number
  showMeta?: boolean
  caption?: string
  description?: string
}

export interface MediaContentProps {
  blobUrl: string
  config: MediaContentConfig
  meta: {
    author: string
    fileSize: number
    title?: string
    date: string
    filetype: string
  }
}

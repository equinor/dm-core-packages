export interface MediaObject {
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

export type FillVariant = 'height' | 'width' | 'both'

export interface MediaViewerPluginConfig {
  height?: number
  width?: number
  fill?: FillVariant
  showMeta?: boolean
  showDescription?: boolean
  caption?: string
  description?: string
}

export type TAttribute = {
  name: string
  type: string
  attributeType: string
  dimensions?: string
  optional?: boolean
  contained?: boolean
  description?: string
  label?: string
  enumType?: string
  default?: any
}

export type TBlueprint = {
  name: string
  type: string
  description?: string
  extends?: string[]
  attributes?: TAttribute[]
  _meta_?: any[]
  abstract?: boolean
}

import { TViewConfig } from '@development-framework/dm-core'

export type TFormProps = {
  idReference?: string
  type?: string
  formData?: any
  config?: TConfig
  onOpen?: (key: string, view: TViewConfig) => void
  onSubmit?: (data: any) => void
}

export type TObjectFieldProps = {
  contained?: boolean
  namePath: string
  type: string
  displayLabel?: string
  optional?: boolean
  config?: TConfig
  uiRecipeName?: string
  uiAttribute?: any
}
export type TAttributeFieldProps = {
  namePath: string
  attribute: any
  uiAttribute?: any
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute?: any
}

type TAttributeBasis = {
  name: string
  widget: string
}
type TAttributeString = TAttributeBasis & { format: string }
type TAttributeArray = TAttributeBasis & { columns: string[] }
type TAttributeObject = TAttributeBasis
type TAttribute = TAttributeArray | TAttributeObject | TAttributeString
export type TConfig = {
  attributes: TAttribute[]
  order: string[]
}

export declare type Variants = 'error' | 'success' | 'warning'

export type TWidget = {
  label: string
  value?: any
  onChange?: (value: any) => void
  onClick?: (value: any) => void
  id: string
  inputRef?: any
  helperText?: string
  variant?: Variants
  type?: string
  readOnly?: boolean
}

export type TWidgets = {
  [key: string]: (props: TWidget) => JSX.Element
}

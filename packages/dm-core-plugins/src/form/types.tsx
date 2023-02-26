export type TFormProps = {
  documentId?: string
  dataSourceId?: string
  type?: string
  formData?: any
  onSubmit?: (data: any) => void
  widgets?: any
  config?: any
  onOpen?: (data: any) => void
}

export type TObjectFieldProps = {
  contained?: boolean
  namePath: string
  type: string
  displayLabel?: string
  optional?: boolean
  config?: any
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

export declare type Variants = 'error' | 'success' | 'error'

export type TWidget = {
  label: string
  value: any
  onChange: (value: any) => void
  onClick?: (value: any) => void
  id: string
  inputRef?: any
  helperText?: string
  variant?: Variants
  namePath: string
  readOnly?: boolean
}

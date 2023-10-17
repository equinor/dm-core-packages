import {
  TAttribute,
  TBlueprint,
  TOnOpen,
  TUiRecipe,
} from '@development-framework/dm-core'

export type TFormProps = {
  idReference: string
  type: string
  formData?: any
  config?: TConfig
  onOpen?: TOnOpen
  onSubmit?: (data: any) => void
}

export type TObjectFieldProps = {
  contained: boolean
  namePath: string
  type: string
  displayLabel: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  defaultValue?: any
}

export type TContentProps = {
  type: string
  namePath: string
  displayLabel: string
  optional: boolean
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm | undefined
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  defaultValue?: any
}

export type TArrayFieldProps = {
  namePath: string
  displayLabel: string
  type: string
  uiAttribute: TAttributeConfig | undefined
  dimensions: string | undefined
  readOnly?: boolean
}

export type TAttributeFieldProps = {
  namePath: string
  attribute: TAttribute
  uiAttribute?: TAttributeConfig
  readOnly?: boolean
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
  isInteger: boolean
  readOnly?: boolean
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
}

type TAttributeBasis = {
  name: string
  type: string
  showInline?: boolean
}
type TAttributeString = TAttributeBasis & { widget: string; format: string }
type TAttributeArray = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
}
type TAttributeObject = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
}
export type TAttributeConfig =
  | TAttributeArray
  | TAttributeObject
  | TAttributeString
export type TConfig = {
  attributes: TAttributeConfig[]
  fields: string[]
  readOnly?: boolean
}

export type TUiRecipeForm = Omit<TUiRecipe, 'config'> & { config: TConfig }

export declare type Variants = 'error' | 'success' | 'warning'

export type TWidget = {
  label: string
  value?: any
  onChange?: (value: unknown) => void
  onClick?: (value: any) => void
  id: string
  inputRef?: any
  helperText?: string
  variant?: Variants
  readOnly?: boolean
}

export type TWidgets = {
  [key: string]: (props: TWidget) => React.ReactElement
}

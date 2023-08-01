import {
  TAttribute,
  TBlueprint,
  TUiRecipe,
  TViewConfig,
} from '@development-framework/dm-core'

export type TFormProps = {
  idReference: string
  type: string
  formData?: any
  config?: TConfig
  onOpen?: (key: string, view: TViewConfig) => void
  onSubmit?: (data: any) => void
}

export type TObjectFieldProps = {
  contained: boolean
  namePath: string
  type: string
  displayLabel: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
}

export type TContentProps = {
  type: string
  namePath: string
  displayLabel: string
  optional: boolean
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm | undefined
}

export type TAttributeFieldProps = {
  namePath: string
  attribute: TAttribute
  uiAttribute?: TAttributeConfig
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute: TAttributeConfig | undefined
}

type TAttributeBasis = {
  name: string
  type: string
}
type TAttributeString = TAttributeBasis & { widget: string; format: string }
type TAttributeArray = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
  columns: string[]
}
type TAttributeObject = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
}
type TAttributeConfig = TAttributeArray | TAttributeObject | TAttributeString
export type TConfig = {
  attributes: TAttributeConfig[]
  fields: string[]
}

export type TUiRecipeForm = Omit<TUiRecipe, 'config'> & { config: TConfig }

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

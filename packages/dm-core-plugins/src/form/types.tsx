import {
  TAttribute,
  TBlueprint,
  TOnOpen,
  TUiRecipe,
} from '@development-framework/dm-core'
import React from 'react'

export type TFormProps = {
  idReference: string
  type: string
  formData?: any
  config?: TFormConfig
  onOpen?: TOnOpen
  onSubmit?: (data: any) => void
}

export type TObjectFieldProps = {
  namePath: string
  displayLabel: string
  uiAttribute: TAttributeObject | undefined
  attribute: TAttribute
}

export type TContentProps = {
  namePath: string
  displayLabel: string
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm
  uiAttribute: TAttributeObject | undefined
  attribute: TAttribute
}

export type TArrayFieldProps = {
  namePath: string
  displayLabel: string
  uiAttribute: TAttributeArray | undefined
  readOnly?: boolean
  showExpanded?: boolean
  attribute: TAttribute
}

export type TAttributeFieldProps = {
  namePath: string
  attribute: TAttribute
  uiAttribute?: TAttributeConfig
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  uiAttribute: TAttributeConfig | undefined
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
  attribute: TAttribute
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
  attribute: TAttribute
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
  attribute: TAttribute
}

type TAttributeBase = {
  name: string
  type: string
  showInline?: boolean
  config?: Record<any, any>
}
type TAttributeString = TAttributeBase & {
  widget: string
  format: string
}
type TAttributeArray = TAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
}
type TAttributeObject = TAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
}
export type TAttributeConfig =
  | TAttributeArray
  | TAttributeObject
  | TAttributeString

export type TFormConfig = {
  attributes: TAttributeConfig[]
  fields: string[]
  readOnly?: boolean
  showExpanded?: boolean
}

export type TUiRecipeForm = Omit<TUiRecipe, 'config'> & {
  config: TFormConfig
}

export declare type Variants = 'error' | 'success' | 'warning'

export type TWidget = {
  label: string
  value?: any // set up input initial and updated value
  onChange: (value: unknown) => void // send data back to hook form
  id: string // unique id to ensure accessibility
  inputRef?: any // allow input to be focused with error
  helperText?: string // show error messages as helper text
  variant?: Variants
  readOnly?: boolean
  config?: Record<any, any>
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
  style?: any
  isDirty?: boolean
  enumType?: any
}

export type TWidgets = {
  [key: string]: (props: TWidget) => React.ReactElement
}

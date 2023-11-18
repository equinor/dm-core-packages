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
  uiAttribute: TAttributeObject | undefined
  readOnly?: boolean
  defaultValue?: any
  showExpanded?: boolean
}

export type TContentProps = {
  type: string
  namePath: string
  displayLabel: string
  optional: boolean
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm
  uiAttribute: TAttributeObject | undefined
  readOnly?: boolean
  defaultValue?: any
  showExpanded?: boolean
}

export type TArrayFieldProps = {
  namePath: string
  displayLabel: string
  type: string
  uiAttribute: TAttributeArray | undefined
  dimensions: string | undefined
  readOnly?: boolean
  showExpanded?: boolean
}

export type TAttributeFieldProps = {
  namePath: string
  attribute: TAttribute
  uiAttribute?: TAttributeConfig
  readOnly?: boolean
  showExpanded?: boolean
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  format?: 'string' | 'date' | 'datetime'
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute: TAttributeConfig | undefined
  readOnly?: boolean
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
}

type TAttributeBasis = {
  name: string
  type: string
  showInline?: boolean
}
type TAttributeString = TAttributeBasis & {
  widget: string
  format: string
}
type TAttributeArray = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
}
type TAttributeObject = TAttributeBasis & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
}
export type TAttributeConfig =
  | TAttributeArray
  | TAttributeObject
  | TAttributeString
export type TConfig = {
  attributes: TAttributeConfig[]
  fields: string[]
  readOnly?: boolean
  showExpanded?: boolean
}

export type TUiRecipeForm = Omit<TUiRecipe, 'config'> & {
  config: TConfig
}

export declare type Variants = 'error' | 'success' | 'warning'

export type TWidget = {
  label: string
  value?: any
  onChange: (value: unknown) => void
  onClick?: (value: any) => void
  id: string
  inputRef?: any
  helperText?: string
  variant?: Variants
  readOnly?: boolean
  config?: Record<any, any>
  leftAdornments?: React.ReactElement | string
  rightAdornments?: React.ReactElement | string
  style?: any
}

export type TWidgets = {
  [key: string]: (props: TWidget) => React.ReactElement
}

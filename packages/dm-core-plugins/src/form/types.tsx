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

export type TObjectTemplate = {
  namePath: string
  blueprint: TBlueprint | undefined
  uiRecipe: TUiRecipeForm
  uiAttribute: TAttributeObject | undefined
  attribute: TAttribute
}

export type TArrayTemplate = {
  namePath: string
  uiAttribute: TAttributeArray | undefined
  attribute: TAttribute
}

export type TField = {
  namePath: string
  uiAttribute: TAttributeConfig | undefined
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
  showExpanded: boolean
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
  isDirty?: boolean
  enumType?: any
}

export type TWidgets = {
  [key: string]: (props: TWidget) => React.ReactElement
}

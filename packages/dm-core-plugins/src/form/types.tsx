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
  onChange?: (data: any) => void
  showSubmitButton?: boolean
}

export type TObjectTemplate = {
  namePath: string
  blueprint?: TBlueprint
  uiRecipe?: TUiRecipeForm
  uiAttribute: TUiAttributeObject | undefined
  attribute: TAttribute
}

export type TArrayTemplate = {
  namePath: string
  uiAttribute: TUiAttributeArray | undefined
  attribute: TAttribute
}

export type TField = {
  namePath: string
  uiAttribute: TUiAttribute | undefined
  attribute: TAttribute
}

type TUiAttributeBase = {
  name: string
  type: string
  showInline?: boolean
  config?: Record<any, any>
}
export type TUiAttributeString = TUiAttributeBase & {
  widget: string
  format: string
  readOnly: boolean
}
type TUiAttributeArray = TUiAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded: boolean
}
export type TUiAttributeObject = TUiAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
  searchByType?: boolean
}
export type TUiAttribute =
  | TUiAttributeArray
  | TUiAttributeObject
  | TUiAttributeString

export type TFormConfig = {
  attributes: TUiAttribute[]
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

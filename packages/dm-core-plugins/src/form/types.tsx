import type {
  TAttribute,
  TOnOpen,
  TUiRecipe,
  TViewConfig,
} from '@development-framework/dm-core'

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
  backgroundColor?: string
}

type TUiAttributeBase = {
  name: string
  type: string
  showInline?: boolean
  config?: Record<any, any>
  readOnly?: boolean
  tooltip?: string
  hideOptionalLabel?: boolean
  label?: string
}
export type TUiAttributeString = TUiAttributeBase & {
  widget: string
  format: string
}
type TUiAttributeArray = TUiAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded: boolean
  template?: string
}
export type TUiAttributeObject = TUiAttributeBase & {
  widget?: string
  uiRecipe?: string
  showExpanded?: boolean
  searchByType?: boolean
  expandViewConfig?: TViewConfig
  openViewConfig?: TViewConfig
  functionality?: {
    expand: boolean
    open: boolean
  }
  hideDelete?: boolean
}

export type TPrimitive = string | number | boolean

export type TUiAttribute =
  | TUiAttributeArray
  | TUiAttributeObject
  | TUiAttributeString

export type TFormConfig = {
  title?: string
  description?: string
  attributes: TUiAttribute[]
  fields: string[]
  readOnly?: boolean
  showExpanded?: boolean
  compactButtons?: boolean
  functionality: {
    expand?: boolean
    open?: boolean
  }
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
  tooltip?: string
}

export type TWidgets = {
  [key: string]: (props: TWidget) => React.ReactElement
}

export type TTemplates = {
  [key: string]: (props: any) => React.ReactElement
}

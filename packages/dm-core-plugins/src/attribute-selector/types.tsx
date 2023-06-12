import {
  TReferenceViewConfig,
  TInlineRecipeViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'

export type TAttributeSelectorItem = {
  view: TReferenceViewConfig | TInlineRecipeViewConfig | TViewConfig
  label?: string
}

export type TItemData = TAttributeSelectorItem & {
  viewId: string
  label: string
  closeable?: boolean
  rootEntityId: string
  // onSubmit is not yet supported
  onSubmit?: (data: TItemData) => void
}

export type TAttributeSelectorConfig = {
  childTabsOnRender?: boolean
  asSidebar?: boolean
  items?: TAttributeSelectorItem[]
}

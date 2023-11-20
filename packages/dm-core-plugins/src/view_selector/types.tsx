import {
  TReferenceViewConfig,
  TInlineRecipeViewConfig,
  TViewConfig,
} from '@development-framework/dm-core'

export type TViewSelectorItem = {
  viewConfig: TReferenceViewConfig | TInlineRecipeViewConfig | TViewConfig
  label?: string
}

export type TItemData = TViewSelectorItem & {
  viewId: string
  label: string
  closeable?: boolean
  rootEntityId: string
  // onSubmit is not yet supported
  onSubmit?: (data: TItemData) => void
  subItems?: TItemData[]
  isSubItem?: boolean
}

export type TViewSelectorConfig = {
  childTabsOnRender?: boolean
  asSidebar?: boolean
  items?: TViewSelectorItem[]
}

import React from 'react'
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
  rootEntityId: string
  onSubmit?: (data: TItemData) => void
}

export type TAttributeSelectorConfig = {
  childTabsOnRender?: boolean
  asSidebar?: boolean
  items?: TAttributeSelectorItem[]
}

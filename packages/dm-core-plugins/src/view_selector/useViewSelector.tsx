import {
  ErrorResponse,
  TGenericObject,
  TInlineRecipeViewConfig,
  TOnOpen,
  TReferenceViewConfig,
  TViewConfig,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { TItemData, TViewSelectorConfig, TViewSelectorItem } from './types'

interface IUseViewSelector {
  addView: TOnOpen
  removeView: (viewId: string) => void
  selectedViewId: string | undefined
  formData: TGenericObject
  isLoading: boolean
  error: ErrorResponse | null
  viewSelectorItems: TItemData[]
  internalConfig: TViewSelectorConfig
  setSelectedViewId: React.Dispatch<any>
  setFormData: React.Dispatch<any>
}

export function useViewSelector(
  idReference: string,
  config: Record<string, any>,
): IUseViewSelector {
  const {
    document: entity,
    isLoading,
    error,
  } = useDocument<TGenericObject>(idReference)
  const [selectedViewId, setSelectedViewId] = useState<string | undefined>()
  const [viewSelectorItems, setViewSelectorItems] = useState<TItemData[]>([])
  const [formData, setFormData] = useState<TGenericObject>({})
  const internalConfig: TViewSelectorConfig = {
    childTabsOnRender: true,
    items: [],
    ...config,
  }

  const addView: TOnOpen = (
    viewId: string,
    viewConfig: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig,
    rootId?: string,
    isSubItem?: boolean,
  ) => {
    if (!viewSelectorItems.find((view: TItemData) => view.viewId === viewId)) {
      // View does not exist, add it
      const newView: TItemData = {
        viewId: viewId,
        viewConfig: viewConfig,
        label: viewConfig.label ?? viewId,
        rootEntityId: rootId || idReference,
        onSubmit: () => undefined,
        closeable: true,
        isSubItem: isSubItem,
      }
      setViewSelectorItems([...viewSelectorItems, newView])
    }
    setSelectedViewId(viewId)
  }

  function removeView(viewId: string) {
    const viewIndex = viewSelectorItems.findIndex(
      (viewSelectorItem) => viewSelectorItem.viewId === viewId,
    )
    const newSelectedView =
      viewSelectorItems[viewIndex + 1]?.viewId ||
      viewSelectorItems[viewIndex - 1]?.viewId ||
      'self'
    const viewsCopy: TItemData[] = [...viewSelectorItems]
    viewsCopy.splice(viewIndex, 1)
    setViewSelectorItems(viewsCopy)
    setSelectedViewId(newSelectedView)
  }

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })

    const newViews: TItemData[] = []
    if (internalConfig.items && internalConfig.items.length) {
      internalConfig.items.forEach((viewItem: TViewSelectorItem) => {
        const backupKey: string = viewItem.viewConfig?.scope ?? 'self' // If the view does not have a scope, the scope is 'self'
        const viewId = crypto.randomUUID()
        newViews.push({
          ...viewItem,
          label: viewItem.label ?? backupKey,
          // Generate UUID to allow for multiple view of same scope
          viewId,
          rootEntityId: idReference,
        })
      })
    } else {
      // No views where passed. Create default for all complex attributes and "self"
      newViews.push({
        label: 'self',
        viewId: 'self',
        viewConfig: {
          type: 'InlineRecipeViewConfig',
          scope: 'self',
          recipe: {
            type: 'UiRecipe',
            name: 'Yaml',
            plugin: '@development-framework/dm-core-plugins/yaml',
          },
          eds_icon: 'home',
        },
        rootEntityId: idReference,
      })
      Object.entries(entity).forEach(
        ([key, attributeEntity]: [string, any]) => {
          if (typeof attributeEntity == 'object') {
            newViews.push({
              viewId: key,
              label: key,
              viewConfig: {
                type: 'ViewConfig',
                scope: key,
              },
              rootEntityId: idReference,
            })
          }
        },
      )
    }
    setViewSelectorItems(newViews)
    setSelectedViewId(newViews[0].viewId)
  }, [entity])

  return {
    addView,
    removeView,
    selectedViewId,
    formData,
    isLoading,
    error,
    viewSelectorItems,
    internalConfig,
    setSelectedViewId,
    setFormData,
  }
}

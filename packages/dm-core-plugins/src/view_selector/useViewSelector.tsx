import {
  type ErrorResponse,
  type TGenericObject,
  type TInlineRecipeViewConfig,
  type TOnOpen,
  type TReferenceViewConfig,
  type TViewConfig,
  useDocument,
} from '@development-framework/dm-core'
import { useEffect, useState } from 'react'
import type { TItemData, TViewSelectorConfig, TViewSelectorItem } from './types'

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
  onSubmit?: (data: any) => void,
  onChange?: (data: any) => void
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
    onSubmitAdded?: (data: any) => void,
    onChangeAdded?: (data: any) => void
  ) => {
    const existingViewIndex = viewSelectorItems.findIndex(
      (view: TItemData) => view.viewId === viewId
    )
    const newView: TItemData = {
      viewId: viewId,
      viewConfig: viewConfig,
      label: viewConfig.label ?? viewId,
      rootEntityId: rootId || idReference,
      onSubmit: onSubmitAdded,
      onChange: onChangeAdded,
      closeable: true,
      isSubItem: isSubItem,
    }
    if (existingViewIndex === -1) {
      // View does not exist, add it
      setViewSelectorItems([...viewSelectorItems, newView])
    } else {
      newView.viewId = viewSelectorItems[existingViewIndex].viewId
      const replaced = [...viewSelectorItems]
      replaced.splice(existingViewIndex, 1, newView)
      setViewSelectorItems(replaced)
    }
    setSelectedViewId(viewId)
  }

  function removeView(viewId: string) {
    const viewIndex = viewSelectorItems.findIndex(
      (viewSelectorItem) => viewSelectorItem.viewId === viewId
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
    let selectedViewId: string = ''
    const newViews: TItemData[] = []
    if (internalConfig.items && internalConfig.items.length) {
      internalConfig.items.forEach((viewItem: TViewSelectorItem) => {
        const backupKey: string = viewItem.viewConfig?.scope ?? 'self' // If the view does not have a scope, the scope is 'self'
        const viewId = crypto.randomUUID()
        newViews.push({
          viewConfig: viewItem.viewConfig,
          subItems: viewItem.subItems,
          eds_icon: viewItem.eds_icon,
          label: viewItem.label ?? backupKey,
          viewId: viewId,
          // Generate UUID to allow for multiple view of same scope
          rootEntityId: idReference,
          onSubmit: onSubmit,
          onChange: onChange,
        })
        viewItem.subItems?.forEach((subItem) => {
          const subBackupKey: string = backupKey + subItem.viewConfig?.scope
          const subViewId = viewId + subItem.viewConfig?.scope
          if (!selectedViewId && viewItem.viewConfig) selectedViewId = viewId
          if (!selectedViewId) selectedViewId = subViewId
          newViews.push({
            viewConfig: subItem.viewConfig,
            subItems: subItem.subItems,
            eds_icon: subItem.eds_icon,
            label: subItem.label ?? subBackupKey,
            // Generate UUID to allow for multiple view of same scope
            viewId: subViewId,
            rootEntityId: idReference,
            onSubmit: onSubmit,
            onChange: onChange,
            closeable: true,
            isSubItem: true,
          })
        })
        if (!selectedViewId && viewItem.viewConfig) selectedViewId = viewId
      })
    } else {
      // No views where passed. Create default for all complex attributes and "self"
      newViews.push({
        label: 'self',
        viewId: 'self',
        eds_icon: 'home',
        viewConfig: {
          type: 'InlineRecipeViewConfig',
          scope: 'self',
          recipe: {
            type: 'UiRecipe',
            name: 'Yaml',
            plugin: '@development-framework/dm-core-plugins/yaml',
          },
        },
        onSubmit: onSubmit,
        onChange: onChange,
        rootEntityId: idReference,
      })
      Object.entries(entity).forEach(
        ([key, attributeEntity]: [string, any]) => {
          if (typeof attributeEntity === 'object') {
            newViews.push({
              viewId: key,
              label: key,
              onSubmit: onSubmit,
              onChange: onChange,
              viewConfig: {
                type: 'ViewConfig',
                scope: key,
              },
              rootEntityId: idReference,
            })
          }
        }
      )
    }
    setViewSelectorItems(newViews)
    setSelectedViewId(selectedViewId)
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

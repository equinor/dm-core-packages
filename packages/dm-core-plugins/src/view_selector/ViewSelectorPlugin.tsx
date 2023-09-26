import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TInlineRecipeViewConfig,
  TOnOpen,
  TReferenceViewConfig,
  TViewConfig,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Content } from './Content'
import { Sidebar } from './Sidebar'
import { Tabs } from './Tabs'
import { TItemData, TViewSelectorConfig, TViewSelectorItem } from './types'

export const ViewSelectorPlugin = (
  props: IUIPlugin & { config?: TViewSelectorConfig }
): JSX.Element => {
  const { idReference, config, type } = props
  const internalConfig: TViewSelectorConfig = {
    childTabsOnRender: true,
    asSidebar: false,
    items: [],
    ...config,
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [entity, isLoading, _, error] = useDocument<TGenericObject>(idReference)
  const [selectedViewId, setSelectedViewId] = useState<string | undefined>()
  const [viewSelectorItems, setViewSelectorItems] = useState<TItemData[]>([])
  const [formData, setFormData] = useState<TGenericObject>({})

  const addView: TOnOpen = (
    viewId: string,
    viewConfig: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig,
    rootId?: string
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
      }
      setViewSelectorItems([...viewSelectorItems, newView])
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
        }
      )
    }
    setViewSelectorItems(newViews)
    setSelectedViewId(newViews[0].viewId)
  }, [entity])

  if (error) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  if (isLoading || !viewSelectorItems.length || !selectedViewId) {
    return <Loading />
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: internalConfig.asSidebar ? 'row' : 'column',
        width: '100%',
      }}
    >
      {internalConfig.asSidebar ? (
        <Sidebar
          viewSelectorItems={viewSelectorItems}
          selectedViewId={selectedViewId}
          setSelectedViewId={setSelectedViewId}
        />
      ) : (
        <Tabs
          viewSelectorItems={viewSelectorItems}
          selectedViewId={selectedViewId}
          setSelectedViewId={setSelectedViewId}
          removeView={removeView}
        />
      )}
      <div
        style={{
          ...(internalConfig.asSidebar
            ? { paddingLeft: '8px' }
            : { paddingTop: '8px' }),
          paddingRight: '8px',
        }}
      >
        <Content
          style={{
            ...(internalConfig.asSidebar
              ? { paddingLeft: '8px' }
              : { paddingTop: '8px' }),
            paddingRight: '8px',
          }}
          type={type}
          onOpen={addView}
          formData={formData}
          selectedViewId={selectedViewId}
          viewSelectorItems={viewSelectorItems}
          setFormData={setFormData}
        />
      </div>
    </div>
  )
}

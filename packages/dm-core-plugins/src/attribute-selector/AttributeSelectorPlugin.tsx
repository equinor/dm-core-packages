import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TViewConfig,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Tabs } from './Tabs'
import { Content } from './Content'
import {
  TAttributeSelectorConfig,
  TAttributeSelectorItem,
  TItemData,
} from './types'

export const AttributeSelectorPlugin = (
  props: IUIPlugin & { config?: TAttributeSelectorConfig }
): JSX.Element => {
  const { idReference, config, type } = props
  const internalConfig: TAttributeSelectorConfig = {
    childTabsOnRender: true,
    asSidebar: false,
    items: [],
    ...config,
  }
  const [entity, isLoading, _, error] = useDocument<TGenericObject>(idReference)
  const [selectedView, setSelectedView] = useState<string | undefined>()
  const [views, setViews] = useState<TItemData[]>([])
  const [formData, setFormData] = useState<TGenericObject>({})

  function addView(viewId: string, view: TViewConfig) {
    if (!views.find((view: TItemData) => view.viewId === viewId)) {
      // View does not exist, add it
      const newView: TItemData = {
        viewId: viewId,
        view: view,
        label: view.label ?? viewId,
        rootEntityId: idReference,
        onSubmit: () => undefined,
      }
      setViews([...views, newView])
    }
    setSelectedView(viewId)
  }

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })

    const newViews: TItemData[] = []
    if (internalConfig.items && internalConfig.items.length) {
      internalConfig.items.forEach((viewItem: TAttributeSelectorItem) => {
        const backupKey: string = viewItem.view?.scope ?? 'self' // If the view does not have a scope, the scope is 'self'
        newViews.push({
          ...viewItem,
          label: viewItem.label ?? backupKey,
          // Generate UUID to allow for multiple view of same scope
          viewId: newViews.find((v) => v.viewId === backupKey)
            ? crypto.randomUUID()
            : backupKey,
          rootEntityId: idReference,
        })
      })
    } else {
      // No views where passed. Create default for all complex attributes and "self"
      newViews.push({
        label: 'self',
        viewId: 'self',
        view: {
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
              view: {
                type: 'ViewConfig',
                scope: key,
              },
              rootEntityId: idReference,
            })
          }
        }
      )
    }
    setViews(newViews)
    setSelectedView(newViews[0].viewId)
  }, [entity])

  if (error) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  if (isLoading || !views.length || !selectedView) {
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
          items={views}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      ) : (
        <Tabs
          items={views}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      )}
      <Content
        type={type}
        onOpen={addView}
        formData={formData}
        selectedView={selectedView}
        items={views}
        setFormData={setFormData}
      />
    </div>
  )
}

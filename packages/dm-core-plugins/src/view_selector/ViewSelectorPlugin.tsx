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
import styled from "styled-components";

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
  const [selectedView, setSelectedView] = useState<string | undefined>()
  const [views, setViews] = useState<TItemData[]>([])
  const [formData, setFormData] = useState<TGenericObject>({})

  const addView: TOnOpen = (
    viewId: string,
    view: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig,
    rootId?: string
  ) => {
    if (!views.find((view: TItemData) => view.viewId === viewId)) {
      // View does not exist, add it
      const newView: TItemData = {
        viewId: viewId,
        view: view,
        label: view.label ?? viewId,
        rootEntityId: rootId || idReference,
        onSubmit: () => undefined,
        closeable: true,
      }
      setViews([...views, newView])
    }
    setSelectedView(viewId)
  }

  function removeView(viewId: string) {
    const viewIndex = views.findIndex((view) => view.viewId === viewId)
    const newSelectedView =
      views[viewIndex + 1]?.viewId || views[viewIndex - 1]?.viewId || 'self'
    const viewsCopy: TItemData[] = [...views]
    viewsCopy.splice(viewIndex, 1)
    setViews(viewsCopy)
    setSelectedView(newSelectedView)
  }

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })

    const newViews: TItemData[] = []
    if (internalConfig.items && internalConfig.items.length) {
      internalConfig.items.forEach((viewItem: TViewSelectorItem) => {
        const backupKey: string = viewItem.view?.scope ?? 'self' // If the view does not have a scope, the scope is 'self'
        const viewId = newViews.find((v) => v.viewId === backupKey)
          ? crypto.randomUUID()
          : backupKey
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
        type={type}
        onOpen={addView}
        formData={formData}
        selectedView={selectedView}
        items={views}
        setFormData={setFormData}
      />
      </div>
    </div>
  )
}

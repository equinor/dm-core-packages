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
  const { idReference, config, onSubmit } = props
  const internalConfig: TAttributeSelectorConfig = {
    childTabsOnRender: true,
    asSidebar: false,
    items: [],
    ...config,
  }
  const [entity, isLoading, _, error] = useDocument<TGenericObject>(idReference)
  const [selectedView, setSelectedView] = useState<number>(0)
  const [views, setViews] = useState<TItemData[]>([])
  const [formData, setFormData] = useState<TGenericObject>({})

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })

    const newViews: TItemData[] = []
    if (internalConfig.items && internalConfig.items.length) {
      internalConfig.items.forEach((viewItem: TAttributeSelectorItem) => {
        newViews.push({
          ...viewItem,
          rootEntityId: idReference,
          onSubmit: (newAttributeData: TGenericObject) => {
            setFormData({
              ...formData,
              [viewItem.view.scope]: newAttributeData,
            })
            if (onSubmit) {
              onSubmit({ ...formData, [viewItem.view.scope]: newAttributeData })
            }
          },
        })
      })
    } else {
      // No views where passed. Create default for all complex attributes and "self"
      newViews.push({
        label: 'self',
        icon: 'home',
        view: {
          type: 'ViewConfig',
          scope: 'self',
        },
        rootEntityId: idReference,
        onSubmit: (newFormData: TGenericObject) => {
          setFormData({ ...newFormData })
          if (onSubmit) {
            onSubmit(newFormData)
          }
        },
      })
      Object.entries(entity).forEach(
        ([key, attributeEntity]: [string, any]) => {
          if (typeof attributeEntity == 'object') {
            newViews.push({
              label: key,
              view: {
                type: 'ViewConfig',
                scope: key,
              },
              rootEntityId: idReference,
              onSubmit: (newAttributeData: TGenericObject) => {
                setFormData({ ...formData, [key]: newAttributeData })
                if (onSubmit) {
                  onSubmit({ ...formData, [key]: newAttributeData })
                }
              },
            })
          }
        }
      )
    }
    setViews(newViews)
  }, [entity])

  if (isLoading || !views) {
    return <Loading />
  }
  if (error) throw new Error(JSON.stringify(error, null, 2))

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
        formData={formData}
        selectedView={selectedView}
        items={views}
        setFormData={setFormData}
      />
    </div>
  )
}

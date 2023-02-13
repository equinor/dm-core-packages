import {
  IUIPlugin,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { TabsProvider } from './TabsContext'
import { Sidebar } from './Sidebar'
import { Tabs } from './Tabs'
import { Content } from './Content'

export type TChildTab = {
  attribute: string
  entity: any
  absoluteDottedId: string
  onSubmit: (data: TChildTab) => void
}

export type TStringMap = {
  [key: string]: TChildTab
}

export type TTabsPluginConfig = {
  childTabsOnRender?: boolean
  homeRecipe?: string
  asSidebar?: boolean
}

export const TabsContainer = (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig, onSubmit } = props
  const config: TTabsPluginConfig = {
    childTabsOnRender: passedConfig?.childTabsOnRender ?? false,
    homeRecipe: passedConfig?.homeRecipe ?? 'home',
    asSidebar: passedConfig?.asSidebar ?? false,
  }
  const [selectedTab, setSelectedTab] = useState<string>('home')
  const [formData, setFormData] = useState<TGenericObject>({})
  const [childTabs, setChildTabs] = useState<TStringMap>({})
  const [entity, isLoading] = useDocument<TGenericObject>(idReference)

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })
    if (config.childTabsOnRender) {
      const newChildTabs: TStringMap = {}
      Object.entries(entity).forEach(([key, attributeData]: [string, any]) => {
        if (typeof attributeData == 'object') {
          newChildTabs[key] = {
            attribute: key,
            entity: attributeData,
            absoluteDottedId: `${idReference}.${key}`,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onSubmit: () => {},
          }
        }
      })
      setChildTabs(newChildTabs)
    }
  }, [entity])

  if (!entity || Object.keys(formData).length === 0)
    return <>No data in entity</>

  if (isLoading) {
    return <Loading />
  }

  return (
    <TabsProvider
      entity={entity}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      childTabs={childTabs}
      setChildTabs={setChildTabs}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      idReference={idReference}
      config={config}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: config.asSidebar ? 'row' : 'column',
        }}
      >
        {config.asSidebar ? <Sidebar /> : <Tabs />}
        <Content />
      </div>
    </TabsProvider>
  )
}

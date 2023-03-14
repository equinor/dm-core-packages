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

export type TAttributeSelectorPluginConfig = {
  childTabsOnRender?: boolean
  homeRecipe?: string
  asSidebar?: boolean
  visibleAttributes?: string[]
}

export const AttributeSelectorPlugin = (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig, onSubmit } = props
  const config: TAttributeSelectorPluginConfig = {
    childTabsOnRender: passedConfig?.childTabsOnRender ?? true,
    homeRecipe: passedConfig?.homeRecipe ?? 'home',
    asSidebar: passedConfig?.asSidebar ?? false,
    visibleAttributes: passedConfig?.visibleAttributes ?? [],
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
        const filteredOutInConfig =
          config?.visibleAttributes !== undefined &&
          config?.visibleAttributes.length > 0 &&
          !config?.visibleAttributes.includes(key)
        if (!filteredOutInConfig && typeof attributeData == 'object') {
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
          width: '100%',
        }}
      >
        {config.asSidebar ? <Sidebar /> : <Tabs />}
        <Content />
      </div>
    </TabsProvider>
  )
}

import { TGenericObject } from '@development-framework/dm-core'
import React, { createContext, useContext } from 'react'
import { TStringMap, TTabsPluginConfig } from './TabsPlugin'

type TabsContextProps = {
  entity: TGenericObject
  selectedTab: string
  setSelectedTab: (x: string) => void
  childTabs: TStringMap
  setChildTabs: (x: TStringMap) => void
  formData: TGenericObject
  setFormData: (x: TGenericObject) => void
  onSubmit: ((data: any) => void) | undefined
  idReference: string
  config: TTabsPluginConfig
}

export const TabsContext = createContext<TabsContextProps>(
  {} as TabsContextProps
)

export const useTabContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabContext must be used within a RegistryProvider')
  }
  return context
}

export const TabsProvider = (
  props: { children: React.ReactNode } & TabsContextProps
) => {
  return (
    <TabsContext.Provider value={props}>{props.children}</TabsContext.Provider>
  )
}

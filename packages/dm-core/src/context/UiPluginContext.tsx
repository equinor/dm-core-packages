import React, { createContext, useContext } from 'react'
import { IUIPlugin, TUiPluginMap } from '../types'
import { ErrorGroup } from '../utils/ErrorBoundary'

type TUiPluginContext = {
  plugins: TUiPluginMap
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => React.ReactElement
}

const UiPluginContext = createContext<TUiPluginContext | undefined>(undefined)

export const useUiPlugins = () => {
  const context = useContext(UiPluginContext)
  if (context === undefined) {
    throw new Error('useUiPlugins must be used within a UiPluginProvider')
  }
  return context
}

export const UiPluginProvider = ({
  pluginsToLoad: plugins,
  children,
}: {
  pluginsToLoad: TUiPluginMap
  children: any
}) => {
  function getUiPlugin(
    pluginName: string
  ): (props: IUIPlugin) => React.ReactElement {
    const plugin = plugins[pluginName]?.component
    if (!plugin)
      return () => (
        <ErrorGroup>Did not find the plugin: {pluginName}</ErrorGroup>
      )
    return plugin
  }

  return (
    <UiPluginContext.Provider value={{ plugins, getUiPlugin }}>
      {children}
    </UiPluginContext.Provider>
  )
}

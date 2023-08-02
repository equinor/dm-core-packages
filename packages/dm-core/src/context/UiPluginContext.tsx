import React, { createContext, useState } from 'react'
import { IUIPlugin, TUiPluginMap } from '../types'
import { ErrorGroup } from '../utils/ErrorBoundary'

type TUiPluginContext = {
  plugins: TUiPluginMap
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element
}

const emptyContext: TUiPluginContext = {
  plugins: {},
  getUiPlugin: () => () => <></>,
}
export const UiPluginContext = createContext<TUiPluginContext>(emptyContext)

export const UiPluginProvider = ({
  pluginsToLoad,
  children,
}: {
  pluginsToLoad: TUiPluginMap
  children: any
}) => {
  const [plugins, setPlugins] = useState<TUiPluginMap>(pluginsToLoad)

  function getUiPlugin(pluginName: string): (props: IUIPlugin) => JSX.Element {
    if (Object.keys(plugins).includes(pluginName))
      return plugins[pluginName].component
    return () => <ErrorGroup>Did not find the plugin: {pluginName}</ErrorGroup>
  }

  return (
    <UiPluginContext.Provider value={{ plugins, getUiPlugin }}>
      {children}
    </UiPluginContext.Provider>
  )
}

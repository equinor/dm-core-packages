import React, { createContext, useEffect, useState } from 'react'
import { IUIPlugin, TPlugin } from '../types'
import { RecipeSelector, UiRecipesSideBarSelector } from '../components'
import { ErrorGroup } from '../utils/ErrorBoundary'

type TUiPluginMap = {
  [pluginName: string]: (props: IUIPlugin) => JSX.Element
}

export interface ILoadedPlugin {
  plugins: TPlugin[]
}

type TUiPluginContext = {
  plugins: TUiPluginMap
  loading: boolean
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element
}

const emptyContext: TUiPluginContext = {
  loading: false,
  plugins: {},
  getUiPlugin: () => () => <></>,
}
export const UiPluginContext = createContext<TUiPluginContext>(emptyContext)

export const UiPluginProvider = ({ pluginsToLoad, children }: any) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [plugins, setPlugins] = useState<TUiPluginMap>({})

  // Async load all the javascript packages defined in packages.json
  // Iterate every package, and adding all the UiPlugins contained in each package to the context
  useEffect(() => {
    // Add builtin plugins
    let newPluginMap: TUiPluginMap = {
      UiRecipeSideBarSelector: UiRecipesSideBarSelector, // @ts-ignore
      'recipe-selector': RecipeSelector,
    }

    Promise.all(
      pluginsToLoad.map(
        async (pluginPackage: any) =>
          await pluginPackage.then((loadedPluginPackage: ILoadedPlugin) =>
            loadedPluginPackage.plugins.map((plugin: TPlugin) => plugin)
          )
      )
    )
      .then((pluginPackageList: any[]) => {
        pluginPackageList.forEach((pluginPackage: TPlugin[]) => {
          pluginPackage.forEach(
            (plugin) =>
              (newPluginMap = {
                ...newPluginMap,
                [plugin.pluginName]: plugin.component,
              })
          )
        })
        setPlugins(newPluginMap)
      })
      .catch((e: any) => {
        console.error(e)
        return []
      })
      .finally(() => setLoading(false))
  }, [pluginsToLoad])

  function getUiPlugin(pluginName: string): (props: IUIPlugin) => JSX.Element {
    if (pluginName in plugins) return plugins[pluginName]
    return () => <ErrorGroup>Did not find the plugin: {pluginName}</ErrorGroup>
  }

  return (
    <UiPluginContext.Provider value={{ plugins, loading, getUiPlugin }}>
      {children}
    </UiPluginContext.Provider>
  )
}

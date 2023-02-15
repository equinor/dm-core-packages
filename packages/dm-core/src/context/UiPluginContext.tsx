import React, { createContext, useEffect, useState } from 'react'
import { IUIPlugin, TPlugin } from '../types'
import { UIPluginSelector, UiRecipesSideBarSelector } from '../components'

export type TExportedPluginInterface = {
  component: (props: IUIPlugin) => JSX.Element
  validationBlueprint?: string
}

type TUiPluginMap = {
  [pluginName: string]: TExportedPluginInterface
}

export interface ILoadedPlugin {
  plugins: TPlugin[]
}

export enum EPluginType {
  UI,
  PAGE,
}

type TUiPluginContext = {
  plugins: TUiPluginMap
  loading: boolean
  getUiPlugin: (pluginName: string) => TExportedPluginInterface
}

const emptyContext: TUiPluginContext = {
  loading: false,
  plugins: {},
  getUiPlugin: () => ({ component: () => <></> }),
}
export const UiPluginContext = createContext<TUiPluginContext>(emptyContext)

export const UiPluginProvider = ({ pluginsToLoad, children }: any) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [plugins, setPlugins] = useState<TUiPluginMap>({})

  // Async load all the javascript packages defined in "plugins.js"
  // Iterate every package, and adding all the UiPlugins contained in each package to the context
  useEffect(() => {
    // Add builtin plugins
    let newPluginMap: TUiPluginMap = {
      UiPluginSelector: { component: UIPluginSelector },
      UiRecipesSideBarSelector: { component: UiRecipesSideBarSelector },
    }

    Promise.all(
      pluginsToLoad.map(async (pluginPackage: any) => {
        return await pluginPackage.plugins.then(
          (loadedPluginPackage: ILoadedPlugin) =>
            loadedPluginPackage.plugins.map((plugin: TPlugin) => ({
              ...plugin,
              validationBlueprintsPackage:
                pluginPackage.validationBlueprintsPackage,
            }))
        )
      })
    )
      .then((pluginPackageList: any[]) => {
        pluginPackageList.forEach((pluginPackage: TPlugin[]) => {
          pluginPackage.forEach(
            (plugin) =>
              (newPluginMap[plugin.pluginName] = {
                component: plugin.component,
                validationBlueprint: plugin.validationBlueprint,
              })
          )
        })
        setPlugins(newPluginMap)
      })
      .catch((e: any) => {
        console.error(e)
        console.error('FAILED TO LOAD ANY PLUGINS!')
        return []
      })
      .finally(() => setLoading(false))
  }, [pluginsToLoad])

  function getUiPlugin(pluginName: string): TExportedPluginInterface {
    if (pluginName in plugins) return plugins[pluginName]
    return { component: <div>Did not find the plugin: {pluginName} </div> }
  }

  return (
    <UiPluginContext.Provider value={{ plugins, loading, getUiPlugin }}>
      {children}
    </UiPluginContext.Provider>
  )
}

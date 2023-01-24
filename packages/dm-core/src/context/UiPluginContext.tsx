import React, { createContext, useEffect, useState } from 'react'
import { TPlugin } from '../types'

type TUiPluginMap = {
  [key: string]: TPlugin
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
  getUiPlugin: (uiRecipeName: string) => TPlugin
  getPagePlugin: (uiRecipeName: string) => TPlugin
}
const emtpyDMTPlugin: TPlugin = {
  pluginType: EPluginType.PAGE,
  pluginName: '',
  component: () => {
    return <div></div>
  },
}
const emptyContext: TUiPluginContext = {
  loading: false,
  plugins: {},
  getUiPlugin: (uiRecipeName: string) => {
    return emtpyDMTPlugin
  },
  getPagePlugin: (uiRecipeName: string) => {
    return emtpyDMTPlugin
  },
}
export const UiPluginContext = createContext<TUiPluginContext>(emptyContext)

export const UiPluginProvider = ({ pluginsToLoad, children }: any) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [plugins, setPlugins] = useState<TUiPluginMap>({})

  // Async load all the javascript packages defined in packages.json
  // Iterate every package, and adding all the UiPlugins contained in each package to the context
  useEffect(() => {
    let newPluginMap: TUiPluginMap
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
              (newPluginMap = { ...newPluginMap, [plugin.pluginName]: plugin })
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

  function getUiPlugin(uiRecipeName: string): TPlugin {
    const pluginName = uiRecipeName.trim()
    if (pluginName in plugins) return plugins[pluginName]
    return {
      pluginName: 'NotFound',
      pluginType: EPluginType.UI,
      component: () => <div>Did not find the plugin: {pluginName} </div>,
    }
  }

  function getPagePlugin(uiRecipeName: string): TPlugin {
    const pluginName = uiRecipeName.trim()
    if (pluginName in plugins) {
      return plugins[pluginName]
    }
    console.warn(
      `No pagePlugin loaded for application '${pluginName}'. Defaulting to the DMT view`
    )
    return plugins['DMT']
  }

  return (
    <UiPluginContext.Provider
      value={{ plugins, loading, getUiPlugin, getPagePlugin }}
    >
      {children}
    </UiPluginContext.Provider>
  )
}

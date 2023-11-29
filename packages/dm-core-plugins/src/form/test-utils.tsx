import {
  DmssAPI,
  DMSSProvider,
  TUiPluginMap,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import { FormPlugin } from './FormPlugin'

export const mockBlueprintGet = (blueprints: Array<any>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'blueprintGet')
  //@ts-ignore
  mock.mockImplementation((props: any) =>
    Promise.resolve({
      data: {
        blueprint: blueprints.find(
          (blueprint: any) => blueprint.name == props.typeRef,
        ),
        uiRecipes: [
          {
            name: 'Edit',
            type: 'dmss://system/SIMOS/UiRecipe',
            plugin: '@development-framework/dm-core-plugins/form',
          },
          {
            name: 'List',
            type: 'dmss://system/SIMOS/UiRecipe',
            plugin: '@development-framework/dm-core-plugins/list',
            dimensions: '*',
          },
        ],
      },
    }),
  )
  return mock
}

const plugins = {
  '@development-framework/dm-core-plugins/form': {
    component: FormPlugin,
  },
} as TUiPluginMap

export const wrapper = (props: { children: React.ReactNode }) => (
  <UiPluginProvider pluginsToLoad={plugins}>
    <DMSSProvider>{props.children}</DMSSProvider>
  </UiPluginProvider>
)

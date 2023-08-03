import { DmssAPI, DMSSProvider } from '@development-framework/dm-core'
import React from 'react'

export const mockBlueprintGet = (blueprints: Array<any>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'blueprintGet')
  //@ts-ignore
  mock.mockImplementation((props: any) =>
    Promise.resolve({
      data: {
        blueprint: blueprints.find(
          (blueprint: any) => blueprint.name == props.typeRef
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
    })
  )
  return mock
}

export const wrapper = (props: { children: React.ReactNode }) => (
  <DMSSProvider>{props.children}</DMSSProvider>
)

import {
  DMApplicationProvider,
  DmssAPI,
  type TUiPluginMap,
} from '@development-framework/dm-core'
import { FormPlugin } from './FormPlugin'

export const mockBlueprintGet = (blueprints: Array<any>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'blueprintGet')
  //@ts-ignore
  mock.mockImplementation((props: any) =>
    Promise.resolve({
      data: {
        blueprint: blueprints.find(
          (blueprint: any) => blueprint.name === props.typeRef
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

export const mockAttributeGet = (
  attributes: Record<string, { address: string; attribute: object }>
) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'attributeGet')
  // @ts-ignore
  mock.mockImplementation((props: { address: string }) =>
    Promise.resolve({
      data: attributes[props.address] ?? {
        address: props.address,
        attribute: { attributeType: 'string', dimensions: '' },
      },
    })
  )
  return mock
}

export const mockDocumentGet = (documents: Record<string, object>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentGet')
  // @ts-ignore
  mock.mockImplementation((props: { address: string }) =>
    Promise.resolve({
      data: documents[props.address] ?? {},
    })
  )
  return mock
}

const plugins = {
  '@development-framework/dm-core-plugins/form': {
    component: FormPlugin,
  },
} as TUiPluginMap

export const wrapper = (props: { children: React.ReactNode }) => (
  <DMApplicationProvider
    plugins={plugins}
    application={{ name: 'test', type: 'test' }}
    dmJobPath={''}
    enableBlueprintCache
  >
    {props.children}
  </DMApplicationProvider>
)

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
      },
    })
  )
  return mock
}

export const wrapper = (props: { children: React.ReactNode }) => (
  <DMSSProvider>{props.children}</DMSSProvider>
)

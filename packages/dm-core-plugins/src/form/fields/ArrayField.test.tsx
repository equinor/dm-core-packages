import { TOnOpen } from '@development-framework/dm-core'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import React from 'react'
import { Form } from '../components/Form'
import { mockBlueprintGet, wrapper } from '../test-utils'
import { TFormConfig } from '../types'

const ViewCreatorMock = jest.fn()
jest.mock('@development-framework/dm-core', () => ({
  __esModule: true,
  ...jest.requireActual('@development-framework/dm-core'),
  ViewCreator: (props: any) => {
    console.log(props)
    ViewCreatorMock(props)
    return <div data-testid="mock-EntityView" />
  },
}))

afterEach(() => cleanup())

describe('List of strings', () => {
  const setup = async (data?: any) => {
    const blueprint = {
      name: 'MyBlueprint',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'array',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          dimensions: '*',
        },
      ],
    }
    mockBlueprintGet([blueprint])
    const utils = render(
      <Form idReference="ds/$1" type="MyBlueprint" formData={data} />,
      { wrapper }
    )
    return await waitFor(() => {
      const addButton = screen.getByRole('button', { name: 'Add' })
      return { ...utils, addButton }
    })
  }

  it('should contain no field in the list by default', async () => {
    await setup()
    await waitFor(() => {
      const inputs = screen.queryAllByTestId('form-textfield')
      expect(inputs.length).toBe(0)
    })
  })

  it('should have an add button', async () => {
    const utils = await setup()
    await waitFor(() => {
      expect(utils.addButton).toBeDefined()
    })
  })

  it('should add a new field when clicking the add button', async () => {
    const utils = await setup()
    fireEvent.click(utils.addButton)
    await waitFor(() => {
      screen.debug()
      const inputs = screen.queryAllByTestId('form-text-widget-', {
        exact: false,
      })
      expect(inputs.length).toBe(1)
    })
  })

  it('should fill an array field with data', async () => {
    const formData = {
      array: ['foo', 'bar'],
    }
    await setup(formData)
    await waitFor(() => {
      const inputs = screen.queryAllByTestId('form-text-widget-', {
        exact: false,
      })
      expect(inputs.length).toBe(2)
      expect(inputs[0].getAttribute('value')).toBe('foo')
      expect(inputs[1].getAttribute('value')).toBe('bar')
    })
  })
})

describe('List of objects', () => {
  const setup = async ({
    config,
    onOpen,
  }: {
    config?: TFormConfig
    onOpen?: TOnOpen
  }) => {
    const outer = {
      name: 'Root',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'array',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'Item',
          dimensions: '*',
        },
      ],
    }
    const inner = {
      name: 'Item',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          dimensions: '*',
        },
      ],
    }
    mockBlueprintGet([outer, inner])
    const formData = {
      array: [
        {
          foo: 'foo',
        },
      ],
    }
    const utils = render(
      <Form
        idReference="ds/$1"
        type="Root"
        formData={formData}
        config={config}
        onOpen={onOpen}
      />,
      {
        wrapper,
      }
    )
    const openButton = screen.findByRole('button', { name: 'Open' })
    const entityView = screen.findByTestId('mock-EntityView')
    return { ...utils, openButton, entityView }
  }

  it('should call ViewCreator if there is no onOpen function', async () => {
    const utils = await setup({
      config: {
        attributes: [
          {
            type: 'PLUGINS:dm-core-plugins/form/fields/ArrayField',
            name: 'array',
            uiRecipe: 'aRecipe',
          },
        ],
        fields: [],
        functionality: {}
      },
    })
    await waitFor(() => {
      expect(utils.entityView).toBeDefined()
      expect(ViewCreatorMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          idReference: 'ds/$1.array',
          onOpen: undefined,
          viewConfig: expect.any(Object)
        })
      )
    })
  })

  it('should show Open button if there is a onOpen button', async () => {
    const onOpen = jest.fn()
    const utils = await setup({ onOpen: onOpen })
    await waitFor(() => {
      expect(utils.openButton).toBeDefined()
    })
  })

  it('should show ViewCreator if config states it', async () => {
    const onOpen = jest.fn()
    const utils = await setup({
      onOpen: onOpen,
      config: {
        attributes: [
          {
            type: 'PLUGINS:dm-core-plugins/form/fields/ArrayField',
            name: 'array',
            uiRecipe: 'aRecipe',
            functionality: {
              open: false,
              expand: true
            }
          },
        ],
        fields: [],
        functionality: {}
      },
    })
    await waitFor(() => {
      expect(utils.entityView).toBeDefined()
      expect(ViewCreatorMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          idReference: 'ds/$1.array',
          onOpen: onOpen,
          viewConfig: expect.any(Object)
        })
      )
    })
  })
})

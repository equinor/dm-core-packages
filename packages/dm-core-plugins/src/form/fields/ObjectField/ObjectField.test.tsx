import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import React from 'react'
import { Form } from '../../components/Form'
import { mockBlueprintGet, wrapper } from '../../test-utils'
import { TFormProps } from '../../types'

afterEach(() => cleanup())

const setupSimple = async (props: TFormProps) => {
  const blueprint = {
    name: 'MyBlueprint',
    type: 'object',
    attributes: [
      {
        name: 'foo',
        type: 'system/SIMOS/BlueprintAttribute',
        attributeType: 'string',
        default: 'beep',
      },
      {
        name: 'bar',
        type: 'system/SIMOS/BlueprintAttribute',
        attributeType: 'boolean',
      },
    ],
  }
  mockBlueprintGet([blueprint])
  const utils = render(<Form {...props} />, { wrapper })
  return await waitFor(() => {
    const fooInput = screen.getByLabelText<HTMLInputElement>('Foo')
    const barInput = screen.getByLabelText<HTMLInputElement>('Bar')
    const inputs = screen.getAllByLabelText<HTMLInputElement>(/.+/i)
    const submit = screen.getByText<HTMLButtonElement>('Submit')
    return { ...utils, fooInput, barInput, inputs, submit }
  })
}

test('should render two inputs', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.inputs.length).toBe(2)
})

test('should render a text input with label foo', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.fooInput).toBeDefined()
  expect(utils.fooInput.type).toBe('text')
})

test('should render a checkbox input with label bar', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.barInput).toBeDefined()
  expect(utils.barInput.type).toBe('checkbox')
})

test('should show foo before bar by default', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.fooInput.compareDocumentPosition(utils.barInput)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  )
})

test('should show foo after bar if order states it', async () => {
  const utils = await setupSimple({
    idReference: 'ds/$1',
    type: 'MyBlueprint',
    config: { attributes: [], fields: ['bar', 'foo'], functionality: {} },
  })
  expect(utils.fooInput.compareDocumentPosition(utils.barInput)).toBe(
    Node.DOCUMENT_POSITION_PRECEDING
  )
})

test('should handle a default object value', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.fooInput.getAttribute('value')).toBe('beep')
  expect(utils.barInput.getAttribute('data-test-checked')).toBe('false')
})

test('should handle object fields change events', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  fireEvent.change(utils.fooInput, { target: { value: 'changed' } })
  expect(utils.fooInput.getAttribute('value')).toBe('changed')
})

test('should render the widget with the expected id', async () => {
  const utils = await setupSimple({ idReference: 'ds/$1', type: 'MyBlueprint' })
  expect(utils.fooInput.getAttribute('id')).toBe('foo')
})

test('should handle optional', async () => {
  mockBlueprintGet([
    {
      type: 'system/SIMOS/Blueprint',
      name: 'Parent',
      attributes: [
        {
          name: 'nested',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'Nested',
          optional: true,
        },
      ],
    },
    {
      type: 'system/SIMOS/Blueprint',
      name: 'Nested',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
        },
      ],
    },
  ])
  render(<Form idReference="ds/$1" type="Parent" />, { wrapper })
  await waitFor(() => {
    // Show optional in label
    expect(screen.getByText('Nested')).toBeDefined()
    // Add button
    expect(screen.getByLabelText('Create new entity')).toBeDefined()
  })
})

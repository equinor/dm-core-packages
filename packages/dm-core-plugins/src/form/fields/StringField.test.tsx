import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Form } from '../components/Form'
import { mockBlueprintGet, wrapper } from '../test-utils'
import { TFormProps } from '../types'

afterEach(() => cleanup())

const setup = async (props: TFormProps) => {
  mockBlueprintGet([
    {
      name: 'SingleField',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          label: 'Foo',
          default: 'boo',
        },
      ],
    },
  ])
  const utils = render(<Form {...props} />, {
    wrapper,
  })
  return await waitFor(() => {
    const textbox = screen.getByRole<HTMLInputElement>('textbox')
    const submit = screen.getByRole('button', { name: 'Submit' })
    return { ...utils, textbox, submit }
  })
}

test('should render a single string field', async () => {
  setup({ idReference: 'ds/$1', type: 'SingleField' })
  await waitFor(() => {
    expect(screen.getAllByRole('textbox').length).toBe(1)
  })
})

test('should render a string field with a label', async () => {
  setup({ idReference: 'ds/$1', type: 'SingleField' })
  await waitFor(() => {
    expect(screen.getByLabelText('Foo')).toBeDefined()
  })
})

test('should fill field with data', async () => {
  const formData = {
    foo: 'beep',
  }
  const utils = await setup({
    idReference: 'ds/$1',
    type: 'SingleField',
    formData: formData,
  })
  await waitFor(() => {
    expect(utils.textbox.value).toBe(formData.foo)
  })
})

test('should assign a default value', async () => {
  const onSubmit = jest.fn()
  const utils = await setup({
    idReference: 'ds/$1',
    type: 'SingleField',
    onSubmit: onSubmit,
  })
  await waitFor(() => {
    expect(utils.textbox.value).toBe('boo')
    fireEvent.submit(utils.submit)
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({
      foo: 'boo',
    })
  })
})

test('should render the widget with the expected id', async () => {
  const utils = await setup({ idReference: 'ds/$1', type: 'SingleField' })

  await waitFor(() => {
    expect(utils.textbox.id).toBe('foo')
  })
})

test('should handle a change event', async () => {
  const utils = await setup({ idReference: 'ds/$1', type: 'SingleField' })

  userEvent.type(utils.textbox, 'foobar')
  await waitFor(() => expect(utils.textbox.value).toBe('boofoobar'))
})

test('should handle an empty string change event', async () => {
  const formData = {
    foo: 'beep',
  }
  const utils = await setup({
    idReference: 'ds/$1',
    type: 'SingleField',
    formData: formData,
  })

  await waitFor(() => expect(utils.textbox.value).toBe(formData.foo))

  userEvent.type(
    utils.textbox,
    '{backspace}{backspace}{backspace}{backspace}hei'
  )

  await waitFor(() => expect(utils.textbox.value).toBe('hei'))

  userEvent.type(utils.textbox, '{backspace}{backspace}{backspace}')

  await waitFor(() => expect(utils.textbox.value).toBe(''))
})

test('should default submit value to empty object', async () => {
  const onSubmit = jest.fn()
  const utils = await setup({
    idReference: 'ds/$1',
    type: 'SingleField',
    onSubmit: onSubmit,
  })

  fireEvent.submit(utils.submit)
  waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({})
  })
})

test('should handle optional', async () => {
  mockBlueprintGet([
    {
      name: 'SingleField',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          optional: true,
        },
      ],
    },
  ])
  const onSubmit = jest.fn()
  const formData = {}
  render(
    <Form
      idReference="ds/$1"
      type="SingleField"
      formData={formData}
      onSubmit={onSubmit}
    />,
    { wrapper }
  )
  fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))
  // The useForm "methods.handleSubmit" seems to be async, and needs to be awaited
  await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  expect(onSubmit).toHaveBeenCalledWith({})
  await waitFor(() => expect(screen.getByText('foo (optional)')).toBeDefined())
})

test.skip('should not call onSubmit if non-optional field are missing value', async () => {
  mockBlueprintGet([
    {
      name: 'SingleField',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          optional: false,
        },
      ],
    },
  ])
  const onSubmit = jest.fn()
  render(<Form idReference="ds/$1" type="SingleField" onSubmit={onSubmit} />, {
    wrapper,
  })
  fireEvent.submit(screen.getByRole('button'))
  await waitFor(() => {
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(0)
  })
})

test.skip('should render a string field with a description', () => {})

test.skip('should handle a blur event', () => {})

test.skip('should handle a focus event', () => {})

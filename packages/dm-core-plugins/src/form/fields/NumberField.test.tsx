import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NumberField } from './NumberField'
import { EBlueprint } from '@development-framework/dm-core'
import { RegistryProvider } from '../context/RegistryContext'
import { defaultConfig } from '../components/Form'

afterEach(() => cleanup())

const setup = async (props: { initialValue?: string; optional?: boolean }) => {
  const { initialValue = '1', optional = false } = props
  const onSubmit = jest.fn()
  const wrapper = (props: { children: React.ReactNode }) => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <RegistryProvider idReference="" config={defaultConfig}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {props.children}
            <button type="submit">Submit</button>
          </form>
        </RegistryProvider>
      </FormProvider>
    )
  }
  const utils = render(
    <NumberField
      attribute={{
        name: 'number',
        type: EBlueprint.ATTRIBUTE,
        attributeType: 'number',
        default: initialValue,
        optional: optional,
      }}
      namePath="number"
      uiAttribute={{ name: '', type: '' }}
    />,
    { wrapper }
  )
  return await waitFor(() => {
    const labelToFind = optional ? 'Number (Optional)' : 'Number'
    const inputElement = screen.getByLabelText<HTMLInputElement>(labelToFind)
    const setValue = (value: string) =>
      fireEvent.change(inputElement, { target: { value: value } })
    const submit = () =>
      fireEvent.click(screen.getByRole<HTMLButtonElement>('button'))
    return { ...utils, inputElement, setValue, submit, onSubmit }
  })
}

test('Input field exists', async () => {
  const utils = await setup({})
  expect(utils.inputElement).toBeDefined()
})

test('Initial value is entered', async () => {
  const utils = await setup({ initialValue: '5e2' })
  expect(utils.inputElement.value).toBe('5e2')
})

test('Error is not raised on exponential', async () => {
  const utils = await setup({})
  utils.setValue('1e2')
  utils.submit()
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).toBeNull()
  })
})

test('Error is not raised on missing, optional input', async () => {
  const utils = await setup({ optional: true })
  utils.setValue('')
  utils.submit()
  await waitFor(() => {
    expect(screen.queryByText('Required')).toBeNull()
  })
})

test('Submit is not called when input is invalid', async () => {
  const utils = await setup({})
  utils.setValue('hei')
  utils.submit()
  await waitFor(() => {
    expect(utils.onSubmit).not.toHaveBeenCalled()
  })
})

test('Submit is called when input is valid', async () => {
  const utils = await setup({})
  utils.setValue('5')
  utils.submit()
  await waitFor(() => {
    expect(utils.onSubmit).toHaveBeenCalled()
  })
})

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

afterEach(() => cleanup())

const setup = async (
  initialValue: string,
  optional: boolean,
  isInteger: boolean
) => {
  const onSubmit = jest.fn()
  const wrapper = (props: { children: React.ReactNode }) => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {props.children}
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    )
  }
  const utils = render(
    <NumberField
      defaultValue={initialValue}
      optional={optional}
      isInteger={isInteger}
      namePath="number"
      displayLabel="number"
      uiAttribute={undefined}
    />,
    { wrapper }
  )
  return await waitFor(() => {
    const input = screen.getByLabelText<HTMLInputElement>('number')
    const submit = screen.getByRole<HTMLButtonElement>('button')
    return { ...utils, input, submit, onSubmit }
  })
}

test('Input field exists', async () => {
  const utils = await setup('', false, false)
  expect(utils.input).toBeDefined()
})

test('Initial value is entered', async () => {
  const utils = await setup('5e2', false, false)
  expect(utils.input.value).toBe('5e2')
})

test('Error is raised on text input', async () => {
  const utils = await setup('hei', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).not.toBeNull()
  })
})

test('Error is raised on invalid number', async () => {
  const utils = await setup('1.', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).not.toBeNull()
  })
})

test('Error is not raised on exponential', async () => {
  const utils = await setup('1e2', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).toBeNull()
  })
})

test('Error is raised on float', async () => {
  const utils = await setup('1.5', false, true)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Only integers allowed')).not.toBeNull()
  })
})

test('Error disappears immediately after fix', async () => {
  const utils = await setup('hei', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).not.toBeNull()
  })
  fireEvent.change(utils.input, { target: { value: '1' } })
  await waitFor(() => {
    expect(screen.queryByText('Only numbers allowed')).toBeNull()
  })
})

test('Error is raised on missing, required input', async () => {
  const utils = await setup('', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Required')).not.toBeNull()
  })
})

test('Error is not raised on missing, optional input', async () => {
  const utils = await setup('', true, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(screen.queryByText('Required')).toBeNull()
  })
})

test('Submit is not called when input is invalid', async () => {
  const utils = await setup('hei', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(utils.onSubmit).not.toHaveBeenCalled()
  })
})

test('Submit is called when input is valid', async () => {
  const utils = await setup('5', false, false)
  fireEvent.submit(utils.submit)
  await waitFor(() => {
    expect(utils.onSubmit).toHaveBeenCalled()
  })
})

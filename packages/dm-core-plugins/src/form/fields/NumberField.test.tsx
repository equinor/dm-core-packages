import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Form } from '../Form'
import { mockBlueprintGet, wrapper } from '../test-utils'

describe('NumberField', () => {
  describe('TextWidget', () => {
    it('should render a single number field', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />, { wrapper })
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1) // TODO type should be number not text
        expect(screen.getByText('foo')).toBeDefined()
      })
    })

    it('should assign a default value', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
              default: 2,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      const { container } = render(
        <Form type="SingleField" onSubmit={onSubmit} />,
        { wrapper }
      )
      await waitFor(() => {
        const inputNode: Element | null =
          container.querySelector(` input[id="foo"]`)
        expect(inputNode).toBeDefined()
        const value = inputNode !== null ? inputNode.getAttribute('value') : ''
        expect(value).toBe('2')
        fireEvent.submit(screen.getByTestId('form-submit'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({
          foo: 2,
        })
      })
    })

    it('should fill field with data', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
              default: 0,
            },
          ],
        },
      ])
      const formData = {
        foo: 2,
      }
      const { container } = render(
        <Form type="SingleField" formData={formData} />,
        { wrapper }
      )
      await waitFor(() => {
        const inputNode: Element | null =
          container.querySelector(` input[id="foo"]`)
        expect(inputNode).toBeDefined()
        const value = inputNode !== null ? inputNode.getAttribute('value') : ''
        expect(value).toBe('2')
      })
    })

    it('should handle a change event', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />, { wrapper })

      await waitFor(() => {
        const inputNode: Element | null =
          container.querySelector(` input[id="foo"]`)
        expect(inputNode).toBeDefined()
        if (inputNode) {
          userEvent.type(inputNode, '2')
          const value =
            inputNode !== null ? inputNode.getAttribute('value') : ''
          expect(value).toBe('2')
        }
      })
    })

    it('should handle optional', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
              optional: true,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      render(<Form type="SingleField" onSubmit={onSubmit} />, { wrapper })
      await waitFor(() => {
        fireEvent.submit(screen.getByTestId('form-submit'))
      })
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith({})
      expect(screen.getByText('foo (optional)')).toBeDefined()
    })

    it('should not call onSubmit if non-optional field are missing value', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
              optional: false,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      render(<Form type="SingleField" onSubmit={onSubmit} />, { wrapper })
      fireEvent.submit(screen.getByTestId('form-submit'))
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledTimes(0)
      })
    })

    it('should handle an empty number change event', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
              default: '432',
              optional: true,
            },
          ],
        },
      ])
      let value = 567

      const formData = {
        foo: value,
      }

      render(<Form type="SingleField" formData={formData} />, { wrapper })
      await waitFor(() => {
        expect(screen.getByTestId('form-textfield').getAttribute('value')).toBe(
          String(value)
        )
      })

      userEvent.type(
        screen.getByTestId('form-textfield'),
        '{backspace}{backspace}{backspace}{backspace}123'
      )

      await waitFor(() => {
        expect(screen.getByTestId('form-textfield').getAttribute('value')).toBe(
          '123'
        )
      })

      userEvent.type(
        screen.getByTestId('form-textfield'),
        '{backspace}{backspace}{backspace}'
      )

      await waitFor(() => {
        expect(screen.getByTestId('form-textfield').getAttribute('value')).toBe(
          ''
        )
      })
    })
  })
})

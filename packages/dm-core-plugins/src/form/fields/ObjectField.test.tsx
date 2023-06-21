import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Form } from '../Form'
import { mockBlueprintGet, wrapper } from '../test-utils'

describe('ObjectField', () => {
  describe('Blueprint', () => {
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

    it.skip('should render a default attribute label', async () => {})

    it('should render a string attribute', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />, { wrapper })
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
        expect(screen.getByText('foo')).toBeDefined()
      })
    })

    it('should render a boolean attribute', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />, { wrapper })
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=checkbox]`).length).toBe(
          1
        )
        expect(screen.getByText('bar')).toBeDefined()
      })
    })

    it('should show foo before bar by default', async () => {
      mockBlueprintGet([blueprint])
      render(<Form type="MyBlueprint" />, { wrapper })
      await waitFor(() => {
        const foo = screen.getByText('foo')
        const bar = screen.getByText('bar')
        expect(foo.compareDocumentPosition(bar)).toBe(
          Node.DOCUMENT_POSITION_FOLLOWING
        )
      })
    })

    it('should show foo after bar if order states it', async () => {
      mockBlueprintGet([blueprint])
      const config = { order: ['bar', 'foo'] }
      render(<Form type="MyBlueprint" config={config} />, { wrapper })
      await waitFor(() => {
        const foo = screen.getByText('foo')
        const bar = screen.getByText('bar')
        expect(foo.compareDocumentPosition(bar)).toBe(
          Node.DOCUMENT_POSITION_PRECEDING
        )
      })
    })

    it('should handle a default object value', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />, { wrapper })

      await waitFor(() => {
        const foo: Element | null = container.querySelector(` input[id="foo"]`)
        expect(foo).toBeDefined()
        const fooValue = foo !== null ? foo.getAttribute('value') : ''
        expect(fooValue).toBe('beep')

        const bar: Element | null = container.querySelector(
          ` input[type="checkbox"]`
        )
        expect(bar).toBeDefined()
        const barValue = bar !== null ? bar.getAttribute('value') : ''
        expect(barValue).toBe('false')
      })
    })

    it.skip('should handle required values', () => {})

    it('should handle object fields change events', async () => {
      mockBlueprintGet([blueprint])
      const onSubmit = jest.fn()
      render(<Form type="MyBlueprint" onSubmit={onSubmit} />, { wrapper })
      await waitFor(() => {
        fireEvent.change(screen.getByTestId('form-textfield'), {
          target: { value: 'changed' },
        })
        expect(screen.getByTestId('form-textfield').getAttribute('value')).toBe(
          'changed'
        )
      })
    })

    it('should render the widget with the expected id', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />, { wrapper })
      await waitFor(() => {
        const inputNode: Element | null =
          container.querySelector(` input[id="foo"]`)
        expect(inputNode).toBeDefined()
        const id = inputNode !== null ? inputNode.getAttribute('id') : ''
        expect(id).toBe('foo')
      })
    })
  })

  it('should handle optional', async () => {
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
    const onSubmit = jest.fn()
    render(<Form type="Parent" onSubmit={onSubmit} />, { wrapper })
    await waitFor(() => {
      // It's ok to submit
      fireEvent.submit(screen.getByText('Submit'))
      expect(onSubmit).toHaveBeenCalled()
      expect(onSubmit).toHaveBeenCalledWith({})
      // Show optional in label
      expect(screen.getByText('nested (optional)')).toBeDefined()
      // Add button
      expect(screen.getByTestId('add-nested')).toBeDefined()
    })
  })

  describe.skip('fields ordering', () => {})

  describe.skip('Title', () => {})
})

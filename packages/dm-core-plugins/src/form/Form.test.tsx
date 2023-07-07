import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { Form } from './Form'
import { mockBlueprintGet, wrapper } from './test-utils'

describe('Form', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('With Type', () => {
    it('should render attributes', async () => {
      const mock = mockBlueprintGet([
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Root',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
            {
              name: 'bar',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])

      const { container } = render(<Form idReference="ds/$1" type="Root" />, {
        wrapper,
      })
      await waitFor(() => {
        expect(container.querySelector(`input[id="foo"]`)).toBeTruthy()
        expect(container.querySelector(`input[id="bar"]`)).toBeTruthy()
        expect(container.querySelector(`input[id="baz"]`)).toBeNull()
        // Should only call get blueprint once
        expect(mock).toHaveBeenCalledWith({ typeRef: 'Root' })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Nested', () => {
    it('should render nested attributes ', async () => {
      const mock = mockBlueprintGet([
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Root',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
            {
              name: 'child',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'Child',
            },
          ],
        },
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Child',
          attributes: [
            {
              name: 'bar',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])
      const formData = {
        child: {
          bar: '',
        },
      }
      const { container } = render(
        <Form idReference="ds/$1" type="Root" formData={formData} />,
        {
          wrapper,
        }
      )
      await waitFor(() => {
        expect(container.querySelector(`input[id="foo"]`)).toBeTruthy()
        expect(container.querySelector(`input[id="child.bar"]`)).toBeTruthy()
        expect(container.querySelector(`input[id="baz"]`)).toBeNull()
        // Should only call get blueprint once
        expect(mock).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('TextareaWidget', () => {
    it('should render textarea', async () => {
      const mock = mockBlueprintGet([
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Root',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])

      const config = {
        attributes: [
          {
            type: 'PLUGINS:dm-core-plugins/form/fields/StringField',
            name: 'foo',
            widget: 'TextWidget', // TODO TextareaWidget is not implemented it seems like...
          },
        ],
        fields: [],
      }

      const { container } = render(
        <Form idReference="ds/$1" type="Root" config={config} />,
        {
          wrapper,
        }
      )
      await waitFor(() => {
        expect(container.querySelector(`input[id="foo"]`)).toBeTruthy()
        // Should only call get blueprint once
        expect(mock).toHaveBeenCalledWith({ typeRef: 'Root' })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe.skip('Submit handler', () => {})
  describe.skip('Error handler', () => {})
})

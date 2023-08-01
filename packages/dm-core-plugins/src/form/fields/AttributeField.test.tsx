import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Form } from '../components/Form'
import { mockBlueprintGet, wrapper } from '../test-utils'

describe('AttributeField', () => {
  describe('Unsupported field', () => {
    it('should warn on invalid type (missing blueprint(', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'invalid',
            },
          ],
        },
      ])
      render(<Form idReference="ds/$1" type="SingleField" />, { wrapper })
      await waitFor(() => {
        expect(
          screen.getByText('Could not find the blueprint', { exact: false })
        ).toBeDefined()
      })
    })
  })
})

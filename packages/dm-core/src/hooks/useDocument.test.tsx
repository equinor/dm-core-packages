import { useDocument } from './useDocument'
import { renderHook } from '@testing-library/react-hooks'

import { waitFor } from '@testing-library/react'
import { mockGetDocument } from '../utils/test-utils-dm-core'

const mockDocument = [
  {
    idReference: 'testDS/1',
    description: 'Description1',
  },
]

describe('useDocumentHook', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe(-'useDocument hook', () => {
    it('should correctly return the document', async () => {
      const mock = mockGetDocument(mockDocument)
      const { result } = renderHook(() => useDocument('testDS/1'))

      await waitFor(() => {
        expect(result.current[0]).toEqual(mockDocument)
        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith({
          idReference: 'testDS/1',
          depth: 1,
        })
      })
    })
    it('return error message when fetching the document fails', async () => {
      const mock = mockGetDocument(mockDocument)
      const { result } = renderHook(() => useDocument('testDS/-1'))

      await waitFor(() => {
        expect(result.current[0]).toEqual(null)
        expect(result.current[1]).toEqual(false)
        expect(result.current[3]).toEqual({ message: undefined, data: 'error' })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })
})

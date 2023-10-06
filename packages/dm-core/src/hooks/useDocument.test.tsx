import { renderHook, waitFor } from '@testing-library/react'
import { useDocument } from './useDocument'
import React from 'react'
import { DMSSProvider } from '../context/DMSSContext'
import { mockGetDocument } from '../utils/test-utils-dm-core'

const mockDocument = [
  {
    reference: 'testDS/1',
    description: 'Description1',
  },
]

const wrapper = (props: { children: React.ReactNode }) => (
  <DMSSProvider>{props.children}</DMSSProvider>
)

describe('useDocumentHook', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe(-'useDocument hook', () => {
    it('should correctly return the document', async () => {
      const mock = mockGetDocument(mockDocument)
      const { result } = renderHook(() => useDocument('testDS/1'), { wrapper })

      await waitFor(() => {
        expect(result.current.document).toEqual(mockDocument)
        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith({
          address: 'testDS/1',
          depth: 1,
        })
      })
    })
    it('return error message when fetching the document fails', async () => {
      const mock = mockGetDocument(mockDocument)
      const { result } = renderHook(() => useDocument('testDS/-1'), { wrapper })

      await waitFor(() => {
        expect(result.current.document).toEqual(null)
        expect(result.current.isLoading).toEqual(false)
        expect(result.current.error).toEqual({
          message: undefined,
          data: 'error',
        })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })
})

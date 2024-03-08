import { renderHook, waitFor } from '@testing-library/react'
import { useDocument } from './useDocument'
import React from 'react'
import { mockGetDocument } from '../utils/test-utils-dm-core'
import { DMApplicationProvider } from "../ApplicationContext";

const mockDocument = [
  {
    reference: 'testDS/1',
    description: 'Description1',
  },
]

const wrapper = (props: { children: React.ReactNode }) => (
      <DMApplicationProvider
    plugins={{}}
    application={{ name: 'test', type: 'test' }}
    dmJobPath={''}
    enableBlueprintCache
  >
  {props.children}
      </DMApplicationProvider>
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
          depth: 0,
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

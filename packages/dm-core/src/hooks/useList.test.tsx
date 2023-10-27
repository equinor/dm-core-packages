import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { useList } from './useList'
import React from 'react'
import { DMSSProvider } from '../context/DMSSContext'
import {
  mockAttributeGet,
  mockDocumentAdd,
  mockDocumentRemove,
  mockGetList,
  mockInstantiateEntity,
  mockUpdateDocument,
} from '../utils/test-utils-dm-core'

const setupContained = () => {
  const attribute = {
    contained: true,
  }

  const mockList = {
    'testDS/1': {
      '0': [
        {
          name: 'document1',
          description: 'Description1',
        },
        {
          name: 'document2',
          description: 'Description2',
        },
      ],
    },
  }

  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
  return {
    mock,
    mockList: mockList['testDS/1'][0],
  }
}

const wrapper = (props: { children: React.ReactNode }) => (
  <DMSSProvider>{props.children}</DMSSProvider>
)

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('contained list', () => {
  test('list items', async () => {
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('should return error message when fetching lists fails', async () => {
    mockAttributeGet({
      contained: true,
    })
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/-1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([])
      expect(result.current.isLoading).toEqual(false)
      expect(result.current.error).toEqual({
        message: undefined,
        data: 'error',
      })
      expect(mock).toHaveBeenCalledTimes(1)
    })
  })

  test('add item and not save', async () => {
    const newEntity = {
      name: 'Document3',
      description: 'Description3',
    }
    mockInstantiateEntity(newEntity)
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(async () => await result.current.addItem(false))
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
        {
          index: 2,
          isSaved: false,
          reference: null,
          key: expect.any(String),
          data: newEntity,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('add item and save', async () => {
    const newEntity = {
      name: 'Document3',
      description: 'Description3',
    }
    mockInstantiateEntity(newEntity)
    mockDocumentAdd(newEntity)
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(async () => await result.current.addItem())
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
        {
          index: 2,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: newEntity,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('remove item and not save', async () => {
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(async () => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
    await waitFor(async () => {
      await result.current.removeItem(result.current.items[0], false)
      expect(result.current.items).toEqual([
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
    })
  })

  test('remove item and save', async () => {
    mockDocumentRemove()
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(async () => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
    await waitFor(async () => {
      await result.current.removeItem(result.current.items[0])
      expect(result.current.items).toEqual([
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
    })
  })

  test('move item up', async () => {
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
    await waitFor(
      async () => await result.current.moveItem(result.current.items[1], 'up')
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
      ])
    })
  })

  test('move item down', async () => {
    const { mock, mockList } = setupContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
    await waitFor(
      async () => await result.current.moveItem(result.current.items[0], 'down')
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
      ])
    })
  })

  test('save items', async () => {
    const { mock, mockList } = setupContained()
    mockUpdateDocument({})
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
    await waitFor(() =>
      result.current.updateAttribute(
        result.current.items[1],
        'description',
        'new description'
      )
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: false,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
    })
    await waitFor(async () => await result.current.save())
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: null,
          key: expect.any(String),
          data: mockList[1],
        },
      ])
    })
  })
})

const setupNonContained = () => {
  const attribute = {
    contained: false,
  }

  const mockList = {
    'testDS/1': {
      '0': [
        {
          referenceType: 'link',
          address: '$1',
          type: 'dmss://system/SIMOS/Reference',
        },
        {
          referenceType: 'link',
          address: '$2',
          type: 'dmss://system/SIMOS/Reference',
        },
      ],
      '1': [
        {
          name: 'document1',
          description: 'Description1',
        },
        {
          name: 'document2',
          description: 'Description2',
        },
      ],
    },
  }

  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
  return {
    mock,
    referenceList: mockList['testDS/1'][0],
    resolvedList: mockList['testDS/1'][1],
  }
}

describe('non contained list with resolve references enabled', () => {
  test('list items', async () => {
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: resolvedList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: resolvedList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('add reference and not save', async () => {
    const newReference = {
      referenceType: 'link',
      address: '$3',
      type: 'dmss://system/SIMOS/Reference',
    }
    const newEntity = {
      name: 'Document3',
      description: 'Description3',
    }
    mockDocumentAdd(newEntity)
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(
      async () => await result.current.addReference('$3', newEntity, false)
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: resolvedList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: resolvedList[1],
        },
        {
          index: 2,
          isSaved: false,
          reference: newReference,
          key: expect.any(String),
          data: newEntity,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('add reference and save', async () => {
    const newReference = {
      referenceType: 'link',
      address: '$3',
      type: 'dmss://system/SIMOS/Reference',
    }
    const newEntity = {
      name: 'Document3',
      description: 'Description3',
    }
    mockDocumentAdd(newEntity)
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1'), { wrapper })
    await waitFor(
      async () => await result.current.addReference('$3', newEntity)
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: resolvedList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: resolvedList[1],
        },
        {
          index: 2,
          isSaved: true,
          reference: newReference,
          key: expect.any(String),
          data: newEntity,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })
})

describe('non contained list with resolve references disabled', () => {
  test('list items', async () => {
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1', false), { wrapper })
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: referenceList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: referenceList[1],
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('add reference and not save', async () => {
    const newReference = {
      referenceType: 'link',
      address: '$3',
      type: 'dmss://system/SIMOS/Reference',
    }
    mockDocumentAdd(newReference)
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1', false), { wrapper })
    await waitFor(
      async () => await result.current.addReference('$3', newReference, false)
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: referenceList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: referenceList[1],
        },
        {
          index: 2,
          isSaved: false,
          reference: newReference,
          key: expect.any(String),
          data: newReference,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })

  test('add reference and save', async () => {
    const newReference = {
      referenceType: 'link',
      address: '$3',
      type: 'dmss://system/SIMOS/Reference',
    }
    mockDocumentAdd(newReference)
    const { mock, resolvedList, referenceList } = setupNonContained()
    const { result } = renderHook(() => useList('testDS/1', false), { wrapper })
    await waitFor(
      async () => await result.current.addReference('$3', newReference)
    )
    await waitFor(() => {
      expect(result.current.items).toEqual([
        {
          index: 0,
          isSaved: true,
          reference: referenceList[0],
          key: expect.any(String),
          data: referenceList[0],
        },
        {
          index: 1,
          isSaved: true,
          reference: referenceList[1],
          key: expect.any(String),
          data: referenceList[1],
        },
        {
          index: 2,
          isSaved: true,
          reference: newReference,
          key: expect.any(String),
          data: newReference,
        },
      ])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        address: 'testDS/1',
        depth: 0,
      })
    })
  })
})

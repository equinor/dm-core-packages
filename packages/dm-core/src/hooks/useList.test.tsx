import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { useList } from './useList'
import React from 'react'
import { DMSSProvider } from '../context/DMSSContext'
import {
  mockAttributeGet,
  mockDocumentAdd,
  mockDocumentRemove,
  mockGetDocument,
  mockGetList,
  mockInstantiateEntity,
  mockUpdateDocument,
} from '../utils/test-utils-dm-core'

const attribute = {
  contained: true,
}

const mockList = [
  {
    name: 'document1',
    description: 'Description1',
  },
  {
    name: 'document2',
    description: 'Description2',
  },
]

const wrapper = (props: { children: React.ReactNode }) => (
  <DMSSProvider>{props.children}</DMSSProvider>
)

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

test('list items', async () => {
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  const mock = mockGetList()
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
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  mockDocumentAdd(newEntity)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  mockDocumentRemove()
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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
  mockAttributeGet(attribute)
  const mock = mockGetList(mockList)
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

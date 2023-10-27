// @ts-nocheck
import { DmssAPI } from '../services/api/DmssAPI'

export const mockGetDocument = (documents: any) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentGet')

  //@ts-ignore
  mock.mockImplementation((parameters) => {
    return documents.some(
      (document: any) => document.reference === parameters['address']
    )
      ? Promise.resolve({
          data: documents,
        })
      : Promise.reject('error')
  })

  return mock
}

export const mockGetList = (documents: list | null = null) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentGet')

  mock.mockImplementation(() => {
    return documents
      ? Promise.resolve({ data: documents })
      : Promise.reject('error')
  })

  return mock
}

export const mockAttributeGet = (attribute: dict | null = null) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'attributeGet')
  mock.mockImplementation(() => {
    return attribute
      ? Promise.resolve({ data: attribute })
      : Promise.reject('error')
  })
  return mock
}

export const mockInstantiateEntity = (newEntity: dict | null = null) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'instantiateEntity')
  mock.mockImplementation(() => {
    return newEntity
      ? Promise.resolve({ data: newEntity })
      : Promise.reject('error')
  })
  return mock
}

export const mockDocumentAdd = (newEntity: dict | null = null) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentAdd')
  mock.mockImplementation(() => {
    return newEntity
      ? Promise.resolve({ data: newEntity })
      : Promise.reject('error')
  })
  return mock
}

export const mockUpdateDocument = (newEntity: dict | null = null) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentUpdate')
  mock.mockImplementation(() => {
    return newEntity
      ? Promise.resolve({ data: newEntity })
      : Promise.reject('error')
  })
  return mock
}

export const mockDocumentRemove = () => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentRemove')
  mock.mockImplementation(() => {
    return Promise.resolve()
  })
  return mock
}

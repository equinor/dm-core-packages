// @ts-nocheck

import { DmssAPI } from '../services/api/DmssAPI'
import React from 'react'

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

import { AxiosError } from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { ErrorResponse } from '../services'

import { toast } from 'react-toastify'
import { useApplication } from '../ApplicationContext'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
interface IUseDocumentReturnType<T> {
  document: T | null
  isLoading: boolean
  updateDocument: (
    newDocument: T,
    notify: boolean,
    partialUpdate?: boolean,
    throwError?: boolean
  ) => Promise<void>
  error: ErrorResponse | null
  setError: Dispatch<SetStateAction<ErrorResponse | null>>
}

/**
 * A hook for asynchronously working with documents.
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useDocument } from '@data-modelling-tool/core'
 *
 * const {
 *   document,
 *   loading,
 *   updateDocument,
 *   error,
 * } = useDocument(dataSourceId, documentId)
 *
 * if (loading) return <div>Loading...</div>
 *
 * if (error) {
 *   console.error(error)
 *   return <div>Error getting the document</div>
 * }
 *
 * <DisplayDocument document={document} />
 * ```
 *
 * @param idReference The ID reference of the document on format DATA_SOURCE/UUID.Attribute
 * @param depth The maximum depth level of nested objects to resolve
 * @param notify Show a pop-up on failed/successful requests
 * @returns A list containing the document, a boolean representing the loading state, a function to update the document, and an Error, if any.
 */
export function useDocument<T>(
  idReference: string,
  depth?: number | undefined,
  notify: boolean = true
): IUseDocumentReturnType<T> {
  const { dmssAPI } = useApplication()
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)
  const queryClient = useQueryClient()
  const queryKeys = ['documents', idReference, depth]
  const documentDepth: number = depth ?? 0
  if (documentDepth < 0 || documentDepth > 999)
    throw new Error('Depth must be a positive number < 999')

  const { isPending, data } = useQuery({
    staleTime: 5 * 1000,
    refetchOnMount: false,
    queryKey: queryKeys,
    queryFn: () =>
      dmssAPI
        .documentGet({
          address: idReference,
          depth: documentDepth,
        })
        .then((response: any) => response.data)
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error)
          if (notify)
            toast.error(
              'Unable to retrieve document, with message: ' +
                error.response?.data.message ?? error.message
            )
          setErrorResponse(
            error.response?.data || { message: error.name, data: error }
          )
        }),
  })

  const mutation = useMutation({
    mutationFn: ({
      newDocument,
      partialUpdate,
      notify,
      throwError,
    }: {
      newDocument: T
      notify?: boolean
      partialUpdate?: boolean
      throwError?: boolean
    }) =>
      dmssAPI
        .documentUpdate({
          idAddress: idReference,
          data: JSON.stringify(newDocument),
          partialUpdate: partialUpdate,
        })
        .then((response: any) => {
          queryClient.setQueryData(queryKeys, response.data.data)
          setErrorResponse(null)
          if (notify) toast.success('Document updated')
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error)
          if (notify) toast.error(error.response?.data.message ?? error.message)
          setErrorResponse(
            error.response?.data || { message: error.name, data: error }
          )
          if (throwError) {
          throw new Error(JSON.stringify(error, null, 2))
        }
        }),
  })

  return {
    document: data || null,
    isLoading: isPending,
    updateDocument: (newDocument: T, notify, partialUpdate, throwError) =>
      mutation.mutateAsync({ newDocument, notify, partialUpdate, throwError }),
    error: errorResponse,
    setError: setErrorResponse
  }
}

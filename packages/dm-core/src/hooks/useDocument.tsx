import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { ErrorResponse } from '../services'
import { useDMSS } from '../context/DMSSContext'

import { toast } from 'react-toastify'

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
 * const [
 *   document,
 *   loading,
 *   updateDocument,
 *   error,
 * ] = useDocument(dataSourceId, documentId)
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
 * @returns A list containing the document, a boolean representing the loading state, a function to update the document, and an Error, if any.
 */
export function useDocument<T>(
  idReference: string,
  depth?: number | undefined
): [
  T | null,
  boolean,
  (newDocument: T, notify: boolean) => void,
  ErrorResponse | null
] {
  const [document, setDocument] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const dmssAPI = useDMSS()

  useEffect(() => {
    setLoading(true)
    const documentDepth: number = depth || 1
    if (documentDepth < 0 || documentDepth > 999)
      throw new Error('Depth must be a positive number < 999')
    dmssAPI
      .documentGet({
        address: idReference,
        depth: documentDepth,
      })
      .then((response: any) => {
        const data = response.data
        setDocument(data)
        setError(null)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(
          'Unable to retrieve document, with message: ' + error.message
        )
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setLoading(false))
  }, [idReference])

  function updateDocument(newDocument: T, notify: boolean): void {
    setLoading(true)
    dmssAPI
      .documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(newDocument),
        updateUncontained: false,
      })
      .then(() => {
        setDocument(newDocument)
        setError(null)
        if (notify) NotificationManager.success('Document updated')
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error('Unable to update document, with message: ' + error.message)
        setError(error.response?.data || { message: error.name, data: error })
      })
      .finally(() => setLoading(false))
  }

  return [document, isLoading, updateDocument, error]
}

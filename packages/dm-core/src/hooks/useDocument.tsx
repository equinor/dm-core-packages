import { useDMSS } from '../context/DMSSContext'
import { ErrorResponse } from '../services'

import { toast } from 'react-toastify'
import {
  useIsMutating,
  UseMutateFunction,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

interface IUseDocumentReturnType<T> {
  document: T | null
  isLoading: boolean
  // updateDocument: (newDocument: T, notify: boolean) => void
  updateDocument: UseMutateFunction<
    AxiosResponse<any, any>,
    AxiosError<ErrorResponse, any>,
    T
  >
  error: ErrorResponse | null
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
 * @returns A list containing the document, a boolean representing the loading state, a function to update the document, and an Error, if any.
 */
export function useDocument<T>(
  idReference: string,
  depth?: number | undefined
): IUseDocumentReturnType<T> {
  // const [document, setDocument] = useState<T | null>(null)
  // const [isLoading, setLoading] = useState<boolean>(true)
  // const [error, setError] = useState<ErrorResponse | null>(null)
  const dmssAPI = useDMSS()
  const documentDepth: number = depth || 1
  // useEffect(() => {
  //   setLoading(true)
  //   // const documentDepth: number = depth || 1
  //   if (documentDepth < 0 || documentDepth > 999)
  //     throw new Error('Depth must be a positive number < 999')
  //   dmssAPI
  //   .documentGet({
  //     address: idReference,
  //     depth: documentDepth,
  //   })
  //   .then((response: any) => {
  //     const data = response.data
  //     setDocument(data)
  //     setError(null)
  //   })
  //   .catch((error: AxiosError<ErrorResponse>) => {
  //     console.error(error)
  //     toast.error(
  //       'Unable to retrieve document, with message: ' +
  //       error.response?.data.message ?? error.message
  //     )
  //     setError(error.response?.data || {message: error.name, data: error})
  //   })
  //   .finally(() => setLoading(false))
  // }, [idReference])

  const {
    isLoading,
    data: document,
    error,
    refetch,
  } = useQuery({
    queryKey: ['document', idReference, documentDepth],
    queryFn: async () => {
      return dmssAPI
        .documentGet({ address: idReference, depth: documentDepth })
        .then((res) => res.data)
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    keepPreviousData: true,
  })

  if (error) {
    console.error(error)
    toast.error(
      'Unable to retrieve document, with message: ' +
        (error as AxiosError<ErrorResponse>).message
    )
  }

  const updateDocument = useMutation({
    mutationKey: ['document', idReference],
    mutationFn: (newDocument: T) => {
      return dmssAPI.documentUpdate({
        idAddress: idReference,
        data: JSON.stringify(newDocument),
        updateUncontained: false,
      })
    },
    onSuccess: () => {
      refetch()
      // queryClient.refetchQueries({
      //   queryKey: ['document', idReference, documentDepth],
      //   exact: true,
      // })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(error)
      toast.error('Unable to update document, with message: ' + error.message)
    },
  })

  const isMutatingDocument = useIsMutating({
    mutationKey: ['document', idReference],
    exact: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // function updateDocument(newDocument: T, notify: boolean): void {
  //   setLoading(true)
  //   dmssAPI
  //   .documentUpdate({
  //     idAddress: idReference,
  //     data: JSON.stringify(newDocument),
  //     updateUncontained: false,
  //   })
  //   .then(() => {
  //     refetch();
  //     // setDocument(newDocument)
  //     // setError(null)
  //     toast.success('Document updated')
  //   })
  //   .catch((error: AxiosError<ErrorResponse>) => {
  //     console.error(error)
  //     toast.error('Unable to update document, with message: ' + error.message)
  //     // setError(error.response?.data || {message: error.name, data: error})
  //   })
  //   .finally(() => setLoading(false))
  // }

  return {
    document: (document as T) || null,
    isLoading: isLoading || isMutatingDocument > 0,
    // TODO: Change the returned function to not be the mutation
    updateDocument: updateDocument.mutate,
    error: error as ErrorResponse,
  }
}

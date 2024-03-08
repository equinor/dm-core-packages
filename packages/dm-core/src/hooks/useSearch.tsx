import { useEffect, useState } from 'react'
import { useApplication } from '../ApplicationContext'

export function useSearch<T>(
  body: any,
  dataSources: string[],
  sortByAttribute?: string
): [T[], boolean, boolean] {
  const [searchResult, setSearchResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { dmssAPI } = useApplication()

  useEffect(() => {
    setIsLoading(true)
    dmssAPI
      .search({
        dataSources: dataSources,
        body: body,
        sortByAttribute: sortByAttribute,
      })
      .then((response: any) => {
        const data = response.data
        setSearchResult(data)
      })
      .catch((err: any) => {
        console.error(err)
        setHasError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return [searchResult, isLoading, hasError]
}

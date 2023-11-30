import { useEffect, useState } from 'react'
import { useDMSS } from '../context/DMSSContext'

export function useSearch<T>(
	body: any,
	dataSourceId: string,
	sortByAttribute?: string
): [T[], boolean, boolean] {
	const [searchResult, setSearchResult] = useState<T[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)
	const dmssAPI = useDMSS()

	useEffect(() => {
		setIsLoading(true)
		dmssAPI
			.search({
				dataSources: [dataSourceId],
				body: body,
				sortByAttribute: sortByAttribute,
			})
			.then((response: any) => {
				const data = response.data
				setSearchResult(Object.values(data))
			})
			.catch((err: any) => {
				console.error(err)
				setHasError(true)
			})
			.finally(() => setIsLoading(false))
	}, [])

	return [searchResult, isLoading, hasError]
}

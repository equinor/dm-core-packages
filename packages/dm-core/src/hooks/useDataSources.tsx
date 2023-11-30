import { useEffect, useState } from 'react'
import DmssAPI from 'src/services/api/DmssAPI'

import { TDataSource } from 'src/types'
import { AxiosResponse, AxiosError } from 'axios'
import { ErrorResponse } from 'src/services'

export const useDataSources = (dmssAPI: DmssAPI): TDataSource[] => {
	const [dataSources, setDataSources] = useState<TDataSource[]>([])

	useEffect(() => {
		dmssAPI
			.dataSourceGetAll()
			.then((response: AxiosResponse<TDataSource[]>) =>
				setDataSources(response.data)
			)
			.catch((error: AxiosError<ErrorResponse>) => console.error(error))
	}, [])

	return dataSources
}

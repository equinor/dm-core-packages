import { useEffect, useState } from 'react'
import type DmssAPI from 'src/services/api/DmssAPI'

import type { AxiosError, AxiosResponse } from 'axios'
import type { DataSourceInformation, ErrorResponse } from 'src/services'

export const useDataSources = (dmssAPI: DmssAPI): DataSourceInformation[] => {
  const [dataSources, setDataSources] = useState<DataSourceInformation[]>([])

  useEffect(() => {
    dmssAPI
      .dataSourceGetAll()
      .then((response: AxiosResponse<DataSourceInformation[]>) =>
        setDataSources(response.data)
      )
      .catch((error: AxiosError<ErrorResponse>) => console.error(error))
  }, [])

  return dataSources
}

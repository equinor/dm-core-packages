import { useEffect, useState } from 'react'
import DmssAPI from 'src/services/api/DmssAPI'

import { AxiosError, AxiosResponse } from 'axios'
import { DataSourceInformation, ErrorResponse } from 'src/services'

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

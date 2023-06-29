import {
  AuthContext,
  DmssAPI,
  EBlueprint,
  ErrorResponse,
  JobStatus,
  Loading,
  TJob,
  IUIPlugin,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { Button, Icon } from '@equinor/eds-core-react'
import { play } from '@equinor/eds-icons'

import { v4 as uuidv4 } from 'uuid'
import { JobControl } from './JobControl'

export const JobPlugin = (props: IUIPlugin) => {
  const { idReference } = props

  const { token } = useContext(AuthContext)
  const DmssApi = new DmssAPI(token)
  const [jobEntityId, setJobEntityId] = useState<string>()
  const dataSource = 'DemoDataSource'

  const [document, loading, error] = useDocument<TGenericObject>(
    idReference,
    999
  )

  if (loading) return <Loading />

  console.log('*********** Job Testing ****************')
  console.log(idReference)
  console.log(document)

  const myuuid = uuidv4()

  // TODO: Find an easier way for users to create valid job entities
  const getJobEntity = (): TJob => {
    return {
      label: 'Example local container job',
      type: EBlueprint.JOB,
      status: JobStatus.NotStarted,
      triggeredBy: 'me',
      applicationInput: {
        name: 'input_proxy',
        type: 'dmss://DemoDataSource/apps/MySignalApp/models/CaseProxy',
        _id: myuuid,
        description: 'sdrawkcab si siht',
        child_id: idReference,
      },
      runner: {
        type: 'dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob',
      },
      started: 'Not started',
    }
  }

  const saveJobEntity = (jobEntity: TJob) => {
    DmssApi.documentAdd({
      reference: `${dataSource}/apps/MySignalApp/instances`,
      document: JSON.stringify(jobEntity),
      updateUncontained: true,
    })
      .then((response: AxiosResponse<any>) => {
        setJobEntityId(`${dataSource}/$${response.data.uid}`)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
      })
  }

  return (
    <div>
      <Button
        onClick={() => saveJobEntity(getJobEntity())}
        variant="contained"
        aria-label="add action"
      >
        <Icon data={play}></Icon>
        Generate Signal
      </Button>

      {jobEntityId && <JobControl jobEntityId={jobEntityId} />}
    </div>
  )
}

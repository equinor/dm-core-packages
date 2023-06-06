import {
  AuthContext,
  DmssAPI,
  EBlueprint,
  ErrorResponse,
  GetJobResultResponse,
  JobStatus,
  Loading,
  TJob,
  useJob,
  IUIPlugin,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import React, { useContext, useState, useEffect } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { Chip } from '@equinor/eds-core-react'
import { Button, Icon } from '@equinor/eds-core-react'
import { play, stop } from '@equinor/eds-icons'

import { v4 as uuidv4 } from 'uuid'

/******************************************************* */
const JobControl = (props: { jobEntityId: string }) => {
  const { jobEntityId } = props
  const {
    start,
    error,
    isLoading,
    fetchResult,
    fetchStatusAndLogs,
    logs,
    status,
    remove,
  } = useJob(jobEntityId)
  const [result, setResult] = useState<GetJobResultResponse>()

  //run once when the object is rendered
  useEffect(() => {
    start()
  }, [])

  if (isLoading) return <Loading />
  if (error)
    return (
      <pre style={{ color: 'red', backgroundColor: 'palegreen' }}>
        {JSON.stringify(error, null, 2)}
      </pre>
    )

  return (
    <div>
      <Chip>Status: {status}</Chip>

      <Button onClick={() => remove()} variant="contained">
        <Icon data={stop}></Icon>
        Stop
      </Button>

      <button
        onClick={() => fetchStatusAndLogs()}
        disabled={status === JobStatus.NotStarted}
      >
        Refresh status and logs
      </button>
      <button
        onClick={() =>
          fetchResult().then((res: GetJobResultResponse) => setResult(res))
        }
        disabled={status === JobStatus.NotStarted}
      >
        Get results
      </button>

      <h4>Logs:</h4>
      <pre>{logs}</pre>

      <h4>Result:</h4>
      {result && (
        <>
          <pre>{result.message}</pre>
          <pre>{result.result}</pre>
        </>
      )}
    </div>
  )
}
/*******************************************************/
//export const Jobs = () => {

export const Jobs = (props: IUIPlugin) => {
  const { idReference } = props

  //const { token } = useContext(AuthContext)
  //const DmssApi = new DmssAPI(token)
  const token = ''
  const DmssApi = new DmssAPI(token)
  const [jobEntityId, setJobEntityId] = useState<string>()
  const dataSource = 'AppStorage'

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
      // @ts-ignore
      //applicationInput: {...document, _id: '2d0dd4a4-0429-4310-ad00-8a33c4039800', _child_id:idReference},
      applicationInput: {
        name: 'input_proxy',
        type: 'dmss://AppStorage/models/CaseProxy',
        _id: myuuid,
        // @ts-ignore
        description: 'sdrawkcab si siht',
        child_id: idReference,
      },
      runner: { type: 'dmss://AppStorage/models/SignalGeneratorJob' },
      started: 'Not started',
    }
  }

  const saveJobEntity = (jobEntity: any) => {
    DmssApi.documentAddToPath({
      pathReference: `${dataSource}/instances`,
      document: JSON.stringify(jobEntity),
      updateUncontained: true,
    })
      .then((response: AxiosResponse<any>) => {
        setJobEntityId(`${dataSource}/${response.data.uid}`)
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

      {jobEntityId && (
        <JobControl
          jobEntityId={
            jobEntityId // @ts-ignore
          }
        />
      )}
    </div>
  )
}

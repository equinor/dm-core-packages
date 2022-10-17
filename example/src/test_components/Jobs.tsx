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
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { Chip } from '@equinor/eds-core-react'

export const JobControl = (props: { jobEntityId: string }) => {
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
      <br />
      <button onClick={() => start()}>Start job</button>
      <button
        onClick={() => remove()}
        disabled={status === JobStatus.NotStarted}
      >
        Remove job
      </button>
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

export const Jobs = () => {
  const { token } = useContext(AuthContext)
  const DmssApi = new DmssAPI(token)
  const [jobEntityId, setJobEntityId] = useState<string>()
  const dataSource = 'DemoDataSource'

  // TODO: Find an easier way for users to create valid job entities
  const getJobEntity = (): TJob => {
    return {
      label: 'Example local container job',
      type: EBlueprint.JOB,
      status: JobStatus.NotStarted,
      triggeredBy: 'me',
      applicationInput: {
        name: 'whatever',
        _id: 'f5282220-4a90-4d02-8f34-b82255fc91d5',
        type: 'system/SIMOS/NamedEntity',
      },
      runner: { type: 'WorkflowDS/Blueprints/ReverseDescription' },
      started: 'Not started',
    }
  }

  const saveJobEntity = (jobEntity: any) => {
    DmssApi.documentAddToPath({
      dataSourceId: dataSource,
      document: JSON.stringify(jobEntity),
      directory: '/DemoPackage',
    })
      .then((response: AxiosResponse<any>) => {
        setJobEntityId(`${dataSource}/${response.data.uid}`)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
      })
  }

  return (
    <div
      style={{
        border: '1px solid green',
        backgroundColor: 'lightgreen',
        padding: '25px',
      }}
    >
      <button onClick={() => saveJobEntity(getJobEntity())}>
        Save job entity
      </button>
      <br />
      <label>Job Entity:</label>
      <pre style={{ backgroundColor: 'darkolivegreen' }}>
        {JSON.stringify(getJobEntity(), null, 2)}
      </pre>

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

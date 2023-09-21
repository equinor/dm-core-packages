import {
  EBlueprint,
  ErrorResponse,
  GetJobResultResponse,
  IUIPlugin,
  JobStatus,
  TJob,
  useDMSS,
  useJob,
} from '@development-framework/dm-core'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CircularProgress,
  Icon,
  Typography,
} from '@equinor/eds-core-react'
import { JobControlButton } from './JobControlButton'
import { refresh } from '@equinor/eds-icons'
import styled from 'styled-components'
import { AxiosError } from 'axios/index'

const JobButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const JobPlugin = (props: IUIPlugin) => {
  // TODO make this plugin general and move to dm-core-packages/packages/dm-core-plugins. Right now, it can only be used in the SignalApp due to hard coded values.
  const DmssApi = useDMSS()
  const [jobEntityId, setJobEntityId] = useState<string>('')
  const [jobId, setJobId] = useState<string | undefined>(undefined)
  const [jobExists, setJobExists] = useState(false)
  const jobEntityDestination = `DemoDataSource/$4483c9b0-d505-46c9-a157-94c79f4d7a6a.study.cases[0].job`
  const [result, setResult] = useState<GetJobResultResponse | null>(null)
  const defaultJobOutputTarget = props.idReference + '.signal'
  // const { dataSource: dataSourceId } = splitAddress(jobEntityDestination)
  const [allowStartJob, setAllowJobStart] = useState(false)
  const [creatingJob, setCreatingJob] = useState(false)

  const {
    start,
    error,
    fetchResult,
    fetchStatusAndLogs,
    logs,
    status,
    remove,
  } = useJob(jobEntityId, jobId)

  // Example of another value for jobEntityDestination
  // const jobEntityDestination = `DemoDataSource/apps/MySignalApp/instances`

  // example of a default job entity for signal app.
  const defaultJobEntity: TJob = {
    label: 'Example local container job',
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    triggeredBy: 'me',
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address:
        'dmss://DemoDataSource/$4483c9b0-d505-46c9-a157-94c79f4d7a6a.study.cases[0]', // TODO support relative syntax: ^.cases[0]
    },
    runner: {
      type: `dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob`,
    },
    started: 'Not started',
  }

  // example of a default azure container job entity for signal app.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultContainerJobEntity: TJob = {
    label: 'Example azure container job',
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    triggeredBy: 'me',
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address:
        'dmss://DemoDataSource/$4483c9b0-d505-46c9-a157-94c79f4d7a6a.study.cases[0]', // TODO support relative syntax: ^.cases[0]
    },
    runner: {
      type: `dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorAzureContainerJob`,
      image: {
        imageName: 'dmt-job/generate-signal',
        type: 'dmss://WorkflowDS/Blueprints/ContainerImage',
        version: 'latest',
        registryName: 'datamodelingtool.azurecr.io',
        description: '',
      },
      name: 'testContainerJobRunner',
      environmentVariables: [],
    },
    started: 'Not started',
  }

  const jobEntityFormData = {
    ...defaultJobEntity,
    outputTarget: defaultJobOutputTarget,
  }

  const updateDocument = (
    jobEntityDestination: string,
    jobEntityFormData: TJob
  ) => {
    DmssApi.documentUpdate({
      idAddress: jobEntityDestination,
      data: JSON.stringify(jobEntityFormData),
    })
      .then(() => {
        setJobEntityId(jobEntityDestination)
        setCreatingJob(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
      })
  }

  const addDocument = (
    jobEntityDestination: string,
    jobEntityFormData: TJob
  ) => {
    DmssApi.documentAdd({
      address: jobEntityDestination,
      document: JSON.stringify(jobEntityFormData),
    })
      .then(() => {
        // The UID cannot be used as ID before the job has been started.
        // Also, the uid returned from the addDocument endpoint differs
        // from the one returned from the startJob endpoint.
        // setJobEntityId(`${dataSourceId}/$${response.data.uid}`)
        setJobEntityId(jobEntityDestination)
        setCreatingJob(false)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
      })
  }

  useEffect(() => {
    if (jobEntityId.length > 0 && allowStartJob) {
      start().then((res) => {
        setJobId(res?.uid)
        setJobExists(true)
      })
    }
  }, [jobEntityId])

  function createNewJob(): void {
    setCreatingJob(true)
    setAllowJobStart(true)
    if (jobExists) {
      updateDocument(jobEntityDestination, jobEntityFormData)
    } else {
      addDocument(jobEntityDestination, jobEntityFormData)
    }
  }

  function fetchJobIfExists(): void {
    DmssApi.documentCheck({
      address: jobEntityDestination,
    }).then((res) => {
      if (res.data) {
        // TODO: Type this endpoint properly
        DmssApi.documentGet({ address: jobEntityDestination }).then((res) => {
          if (!jobEntityId.length) setJobEntityId(jobEntityDestination)
          // @ts-ignore
          setJobId(res.data.uid)
          setJobExists(true)
        })
      }
    })
  }

  useEffect(fetchJobIfExists, [])

  return (
    <Card elevation={'raised'} style={{ padding: '1.25rem' }}>
      <JobButtonWrapper>
        {jobExists ? (
          <>
            <JobControlButton
              jobStatus={status}
              start={() => {
                setResult(null)
                return start()
              }}
              halt={remove}
            />
            {status === JobStatus.Running && (
              <Button
                variant="outlined"
                onClick={() => fetchStatusAndLogs()}
                aria-label="Get job status"
              >
                <Icon data={refresh} />
              </Button>
            )}
            <Button
              onClick={() =>
                fetchResult().then((res: GetJobResultResponse) =>
                  setResult(res)
                )
              }
              variant={'outlined'}
              disabled={status === JobStatus.NotStarted}
            >
              Get results
            </Button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button onClick={() => createNewJob()} style={{ width: '7rem' }}>
              {creatingJob ? (
                <>
                  <CircularProgress size={16} variant="indeterminate" />
                  <span>Creating</span>
                </>
              ) : (
                <span>Create job</span>
              )}
            </Button>
            <Typography>
              Once a job has been created, it will automatically run once.
            </Typography>
          </div>
        )}
      </JobButtonWrapper>

      {status === JobStatus.Failed && (
        <Card variant="danger" style={{ marginTop: '8px' }}>
          <Card.Header>Job status: {status}</Card.Header>
        </Card>
      )}
      {jobExists && (error || logs) && (
        <>
          <Typography variant="h6">Logs:</Typography>
          {error ? (
            <pre>{JSON.stringify(error, null, 2)}</pre>
          ) : (
            <pre>{logs}</pre>
          )}
        </>
      )}

      {result && (
        <>
          <Typography variant="h6">Result:</Typography>
          <pre>{result.message}</pre>
          <pre>{result.result}</pre>
        </>
      )}
    </Card>
  )
}

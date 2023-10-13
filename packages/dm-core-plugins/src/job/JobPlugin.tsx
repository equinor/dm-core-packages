import {
  EBlueprint,
  ErrorResponse,
  GetJobResultResponse,
  IUIPlugin,
  JobStatus,
  TJob,
  TJobHandler,
  useDMSS,
  useJob,
} from '@development-framework/dm-core'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Icon, Typography } from '@equinor/eds-core-react'
import { JobControlButton } from './JobControlButton'
import { refresh } from '@equinor/eds-icons'
import styled from 'styled-components'
import { AxiosError } from 'axios'
import { AuthContext } from 'react-oauth2-code-pkce'

const JobButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

interface ITargetAddress {
  targetAddress: string
  addressScope?: 'local' | 'global'
}

interface JobPluginConfig {
  jobTargetAddress: ITargetAddress
  label: string
  runner: TJobHandler
  outputTarget: string
  jobInput: ITargetAddress
}

export const JobPlugin = (props: IUIPlugin & { config: JobPluginConfig }) => {
  const {
    config,
    idReference,
  }: { config: JobPluginConfig; idReference: string } = props
  const DmssApi = useDMSS()

  const jobTargetAddress = (): string => {
    if (config.jobTargetAddress.addressScope !== 'local') {
      return config.jobTargetAddress.targetAddress
    }
    if (['self', '.'].includes(config?.jobTargetAddress.targetAddress)) {
      return idReference
    }
    return idReference + config.jobTargetAddress.targetAddress
  }

  const jobInputAddress = (): string => {
    if (config.jobInput.addressScope !== 'local') {
      return config.jobInput.targetAddress
    }
    if (['self', '.'].includes(config.jobInput.targetAddress)) {
      return idReference
    }
    return idReference + config.jobInput.targetAddress
  }
  const { tokenData } = useContext(AuthContext)
  const username = tokenData?.preferred_username

  const [jobEntityId, setJobEntityId] = useState<string>('')
  const [jobId, setJobId] = useState<string | undefined>(undefined)
  const [jobExists, setJobExists] = useState(false)
  const [result, setResult] = useState<GetJobResultResponse | null>(null)
  const [allowStartJob, setAllowJobStart] = useState(false)

  const {
    start,
    error,
    fetchResult,
    fetchStatusAndLogs,
    logs,
    status,
    remove,
  } = useJob(jobEntityId, jobId)

  const jobEntity: TJob = {
    label: config?.label,
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    triggeredBy: username ?? 'unknown user', // TODO: Add proper fallback
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: jobInputAddress(),
    },
    runner: config?.runner,
  }

  if (config?.outputTarget) jobEntity.outputTarget = config.outputTarget

  const updateDocument = async (
    jobAddress: string,
    jobEntityFormData: TJob
  ): Promise<unknown> => {
    return DmssApi.documentUpdate({
      idAddress: jobAddress,
      data: JSON.stringify(jobEntityFormData),
    })
      .then(() => {
        setJobEntityId(jobAddress)
        return Promise.resolve()
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
      })
  }

  const addDocument = async (
    jobAddress: string,
    jobEntityFormData: TJob
  ): Promise<unknown> => {
    return DmssApi.documentAdd({
      address: jobAddress,
      document: JSON.stringify(jobEntityFormData),
    })
      .then((res) => {
        // The UID cannot be used as ID before the job has been started.
        // Also, the uid returned from the addDocument endpoint differs
        // from the one returned from the startJob endpoint.
        // setJobEntityId(`${dataSourceId}/$${response.data.uid}`)
        setJobEntityId(jobAddress)
        return Promise.resolve(res)
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

  function createNewJob(): Promise<unknown> {
    setAllowJobStart(true)
    if (jobExists) {
      return updateDocument(jobTargetAddress(), jobEntity)
    } else {
      return addDocument(jobTargetAddress(), jobEntity)
    }
  }

  function fetchJobIfExists(): void {
    DmssApi.documentCheck({
      address: jobTargetAddress(),
    }).then((res) => {
      if (res.data) {
        // TODO: Type this endpoint properly
        DmssApi.documentGet({ address: jobTargetAddress() }).then((res) => {
          if (!jobEntityId.length) setJobEntityId(jobTargetAddress())
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
        <JobControlButton
          jobStatus={status}
          jobExists={jobExists}
          createJob={createNewJob}
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
            fetchResult().then((res: GetJobResultResponse) => setResult(res))
          }
          variant={'outlined'}
          disabled={status === JobStatus.NotStarted}
        >
          Get results
        </Button>
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

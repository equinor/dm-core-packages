import {
  EBlueprint,
  ErrorResponse,
  GetJobResultResponse,
  IUIPlugin,
  JobStatus,
  TJob,
  TJobHandler,
  TSchedule,
  useDMSS,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
} from 'react'
import {
  Button,
  Card,
  Icon,
  Switch,
  TextField,
  Typography,
} from '@equinor/eds-core-react'
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

  const jobTargetAddress = useMemo((): string => {
    if ((config.jobTargetAddress.addressScope ?? 'local') !== 'local') {
      return config.jobTargetAddress.targetAddress
    }
    if (['self', '.'].includes(config?.jobTargetAddress.targetAddress)) {
      return idReference
    }
    return idReference + config.jobTargetAddress.targetAddress
  }, [config])

  const jobInputAddress = useMemo((): string => {
    if ((config.jobInput.addressScope ?? 'local') !== 'local') {
      return config.jobInput.targetAddress
    }
    if (['self', '.'].includes(config.jobInput.targetAddress)) {
      return idReference
    }
    return idReference + config.jobInput.targetAddress
  }, [config])
  const { tokenData } = useContext(AuthContext)
  const username = tokenData?.preferred_username

  const [jobExists, setJobExists] = useState(false)
  const [result, setResult] = useState<GetJobResultResponse | null>(null)
  const [asCronJob, setAsCronJob] = useState<boolean>(false)
  const [jobSchedule, setJobSchedule] = useState<TSchedule>({
    type: EBlueprint.CRON_JOB,
    cron: '',
    startDate: '',
    endDate: '',
  })
  const {
    document: jobDocument,
    isLoading,
    error: jobEntityError,
    updateDocument,
  } = useDocument(jobTargetAddress, 0, false)

  const { start, error, fetchResult, fetchStatusAndLogs, logs, status } =
    useJob(jobTargetAddress)

  const jobEntity: TJob = {
    label: config?.label,
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    triggeredBy: username ?? 'unknown user', // TODO: Add proper fallback
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: jobInputAddress,
    },
    runner: config?.runner,
  }

  if (config?.outputTarget) jobEntity.outputTarget = config.outputTarget
  if (asCronJob)
    jobEntity.schedule = {
      type: EBlueprint.CRON_JOB,
      cron: jobSchedule.cron,
      startDate: jobSchedule.startDate,
      endDate: jobSchedule.endDate,
    }

  const addDocument = async (): Promise<unknown> => {
    return DmssApi.documentAdd({
      address: jobTargetAddress,
      document: JSON.stringify(jobEntity),
    }).catch((error: AxiosError<ErrorResponse>) => {
      console.error(error.response?.data)
    })
  }

  function createAndStartJob() {
    setResult(null)
    if (jobExists) {
      updateDocument(jobEntity, false).then(() => start())
      return
    }
    addDocument().then(() => {
      start().then(() => setJobExists(true))
    })
  }

  useEffect(() => {
    if (!jobDocument) return
    if (Object.keys(jobDocument).length) setJobExists(true)
  }, [isLoading, jobEntityError, jobDocument])

  return (
    <Card elevation={'raised'} style={{ padding: '1.25rem' }}>
      <Switch
        size="small"
        label="As cron job"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setAsCronJob(e.target.checked)
        }
        checked={asCronJob}
      />
      {asCronJob && (
        <>
          <TextField
            id="cronString"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setJobSchedule({ ...jobSchedule, cron: e.target.value })
            }
            placeholder="String with cron syntax, e.g. '30 12 * * 3'"
            defaultValue={'0 8 * * *'}
            label={'Cron string'}
          />
          <TextField
            id="startDate"
            defaultValue={jobSchedule.startDate}
            type="datetime-local"
            onChange={(e: any) =>
              setJobSchedule({ ...jobSchedule, startDate: e.target.value })
            }
            label={'Valid from'}
          />
          <TextField
            id="endDate"
            defaultValue={jobSchedule.endDate}
            type="datetime-local"
            onChange={(e: any) =>
              setJobSchedule({ ...jobSchedule, endDate: e.target.value })
            }
            label={'Valid to'}
          />
        </>
      )}
      <JobButtonWrapper>
        <JobControlButton
          jobStatus={status}
          createJob={createAndStartJob}
          asCronJob={asCronJob}
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
      {jobExists && (
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

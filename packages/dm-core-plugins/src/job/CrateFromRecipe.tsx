import {
  EBlueprint,
  ErrorResponse,
  GetJobResultResponse,
  IUIPlugin,
  JobStatus,
  TJob,
  TJobHandler,
  TRecurringJob,
  TSchedule,
  useDMSS,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Chip, LinearProgress } from '@equinor/eds-core-react'
import { JobControlButton } from './JobControlButton'
import styled from 'styled-components'
import { AxiosError } from 'axios'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getNewJobDocument, scheduleTemplate } from './templateEntities'
import { RemoveJobDialog } from './RemoveJobDialog'
import { ConfigureRecurring, getVariant, JobLog } from './common'

const JobButtonWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
`

interface ITargetAddress {
  targetAddress: string
  addressScope?: 'local' | 'global'
}

interface JobPluginConfig {
  jobTargetAddress: ITargetAddress
  recurring?: boolean
  label: string
  runner: TJobHandler
  outputTarget: string
  jobInput: ITargetAddress
  showGetResult?: boolean
}

export const CrateFromRecipe = (
  props: IUIPlugin & { config: JobPluginConfig }
) => {
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

  const { tokenData } = useContext(AuthContext)
  const username = tokenData?.preferred_username ?? 'unknown user'

  const [result, setResult] = useState<GetJobResultResponse | null>(null)
  const [asCronJob, setAsCronJob] = useState<boolean>(config.recurring ?? false)
  const [schedule, setSchedule] = useState<TSchedule>(scheduleTemplate())
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false)

  const jobEntity: TJob | TRecurringJob = useMemo(
    () =>
      getNewJobDocument({
        config,
        username,
        idReference,
        asCronJob,
        schedule,
      }),
    [asCronJob, schedule]
  )

  const {
    document: jobDocument,
    isLoading,
    error: jobEntityError,
    updateDocument,
  } = useDocument<TJob | TRecurringJob>(jobTargetAddress, 0, false)

  const {
    start,
    error,
    fetchResult,
    fetchStatusAndLogs,
    logs,
    progress,
    status,
    exists,
    remove,
  } = useJob(jobTargetAddress, jobDocument?.uid)

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
    if (jobDocument) {
      updateDocument(jobEntity, false).then(() => start())
      return
    }
    addDocument().then(() => start())
  }

  useEffect(() => {
    if (!jobDocument) return
    if (asCronJob || jobDocument.type === EBlueprint.RECURRING_JOB)
      // @ts-ignore
      setSchedule(jobDocument?.schedule)
    if (jobDocument.type === EBlueprint.RECURRING_JOB) setAsCronJob(true)
  }, [isLoading, jobEntityError, jobDocument])

  return (
    <div>
      {asCronJob && (
        <ConfigureRecurring
          schedule={schedule}
          setSchedule={setSchedule}
          asCron={asCronJob}
          setAsCron={setAsCronJob}
          registered={
            !!jobDocument && jobDocument?.status !== JobStatus.NotStarted
          }
        />
      )}
      <JobButtonWrapper>
        <JobControlButton
          jobStatus={status}
          createJob={createAndStartJob}
          remove={remove}
          confirmRemove={() => setShowRemoveDialog(true)}
          asCronJob={asCronJob}
          exists={exists}
        />
        {config.showGetResult && (
          <Button
            onClick={() =>
              fetchResult().then((res: GetJobResultResponse) => setResult(res))
            }
            variant={'outlined'}
            disabled={status !== JobStatus.Completed}
          >
            Get results
          </Button>
        )}
        <JobLog logs={logs} error={error} />
        <Chip variant={getVariant(status)}>{status ?? 'Not registered'}</Chip>
      </JobButtonWrapper>
      {status === JobStatus.Running && progress !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <LinearProgress
            aria-label='Progress bar label'
            value={progress * 100}
            variant='determinate'
            style={{
              marginRight: '10px',
            }}
          />
          <pre>{Math.round(progress * 100)}%</pre>
        </div>
      )}
      <RemoveJobDialog
        isOpen={showRemoveDialog}
        onConfirm={remove}
        close={() => {
          setShowRemoveDialog(false)
        }}
      />
    </div>
  )
}

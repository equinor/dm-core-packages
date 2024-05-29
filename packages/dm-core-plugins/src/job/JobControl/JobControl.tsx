import {
  AuthContext,
  EBlueprint,
  ErrorResponse,
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  TJobHandler,
  TRecurringJob,
  TSchedule,
  useApplication,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import {
  Button,
  Chip,
  Icon,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { gear } from '@equinor/eds-icons'
import { AxiosError } from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useContext, useEffect, useState } from 'react'
import { IAuthContext } from 'react-oauth2-code-pkce'
import { toast } from 'react-toastify'
import { TTemplate, TemplateMenu } from '../../common'
import {
  ConfigureRecurring,
  JobButtonWrapper,
  JobLog,
  Progress,
  TCronValues,
  getControlButton,
  getVariant,
  parseCronStringToCronValues,
  parseCronValuesToCronString,
} from '../common'
import { defaultCronValues, scheduleTemplate } from '../templateEntities'

type TJobControlConfig = {
  hideLogs?: boolean
  runnerTemplates?: TTemplate[]
  title?: string
}

const defaultConfig: TJobControlConfig = {
  hideLogs: false,
}

export const JobControl = (props: IUIPlugin) => {
  const { idReference, config } = props
  const { dmssAPI } = useApplication()
  const { tokenData }: IAuthContext = useContext(AuthContext)

  const internalConfig: TJobControlConfig = { ...defaultConfig, ...config }
  const [asCronJob, setAsCronJob] = useState<boolean>(false)
  const [schedule, setSchedule] = useState<TSchedule>(scheduleTemplate())
  const [cronValues, setCronValues] = useState<TCronValues>(defaultCronValues())
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
  const [templates, setTemplates] = useState<any[]>([])
  const {
    document: jobEntity,
    isLoading,
    updateDocument,
    error: jobEntityError,
  } = useDocument<TJob | TRecurringJob>(idReference, 0, false)

  const {
    start: startJob,
    error,
    logs,
    progress,
    status,
    remove,
    isLoading: jobIsLoading,
  } = useJob(idReference, jobEntity?.uid)

  function start() {
    if (!jobEntity) return

    const newJob = structuredClone(jobEntity)
    newJob.triggeredBy =
      tokenData?.preferred_username || tokenData?.name || 'Anonymous'
    if (asCronJob) {
      ;(newJob as TRecurringJob).schedule = schedule
      if (
        DateTime.fromISO(schedule.endDate) <
        DateTime.fromISO(schedule.startDate)
      ) {
        toast.error(
          'Invalid date range for schedule. End date must be after start date'
        )
        return
      }
    }
    updateDocument(newJob, false)
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
      .then(startJob)
  }

  function handleRunnerTemplateSelect(template: TTemplate) {
    dmssAPI
      .documentGet({ address: template.path })
      .then((response) => {
        const templateEntity: TJobHandler = response.data as TJobHandler
        const newJobDocument = window.structuredClone(jobEntity) as TJob
        if (asCronJob) {
          newJobDocument.applicationInput = {
            ...newJobDocument?.applicationInput,
            runner: templateEntity,
          }
        } else {
          newJobDocument.runner = templateEntity
        }
        updateDocument(newJobDocument, false).catch(
          (error: AxiosError<ErrorResponse>) => {
            console.error(error)
            toast.error(error.response?.data.message)
          }
        )
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        toast.error(error.response?.data.message)
      })
  }

  useEffect(() => {
    if (!jobEntity) return
    if (
      ![String(EBlueprint.JOB), String(EBlueprint.RECURRING_JOB)].includes(
        jobEntity.type
      )
    ) {
      throw new Error(
        `Wrong entity type recieved by job plugin. Got: \n ${JSON.stringify(
          jobEntity,
          null,
          2
        )}`
      )
    }
    if (asCronJob || jobEntity.type === EBlueprint.RECURRING_JOB) {
      const loadedSchedule = {
        ...schedule,
        ...(jobEntity as TRecurringJob)?.schedule,
      }
      setSchedule({ ...loadedSchedule })
      setCronValues(parseCronStringToCronValues(loadedSchedule.cron))
    }
    if (jobEntity.type === EBlueprint.RECURRING_JOB) setAsCronJob(true)

    Promise.all(
      // @ts-ignore
      internalConfig.runnerTemplates?.map(async (template: TTemplate) => {
        const response = await dmssAPI.documentGet({ address: template.path })
        return response.data as TJobHandler
      })
      // @ts-ignore
    ).then((templates: TJobHandler[]) => setTemplates(templates))
  }, [jobEntity])

  if (isLoading || !jobEntity) return <Loading />

  if (jobEntityError)
    throw new Error(JSON.stringify(error || jobEntityError, null, 2))

  return (
    <div className='dm-plugin-padding'>
      <div className='flex flex-col gap-1 border rounded-md bg-equinor-lightgray p-2'>
        {internalConfig.title && (
          <Typography variant='h6'>{config.title}</Typography>
        )}
        {asCronJob && (
          <div className='rounded-md p-2 bg-white border'>
            <ConfigureRecurring
              asCron={asCronJob}
              readOnly={true}
              schedule={schedule}
              setSchedule={(s: TSchedule) => {
                setSchedule(s)
                setCronValues(parseCronStringToCronValues(s.cron))
              }}
              cronValues={cronValues}
              setCronValues={(c: TCronValues) => {
                setSchedule({
                  ...schedule,
                  cron: parseCronValuesToCronString(c),
                })
                setCronValues(c)
              }}
              registered={status === JobStatus.Registered}
            />
          </div>
        )}
        <JobButtonWrapper>
          <div className='flex items-center space-x-2'>
            {getControlButton(status, remove, start, false, jobIsLoading)}
            <div className='flex flex-row items-center'>
              <p className='text-sm'>Status:</p>
              <Chip variant={getVariant(status)} data-testid={'jobStatus'}>
                {status ?? 'Not registered'}
              </Chip>
            </div>

            {!internalConfig.hideLogs && <JobLog logs={logs} error={error} />}
          </div>

          {internalConfig.runnerTemplates &&
            internalConfig.runnerTemplates.length > 0 && (
              <div className={'flex flex-row items-center justify-end'}>
                <Tooltip
                  title={`Change runner. Current: ${(
                    (asCronJob
                      ? jobEntity.applicationInput?.runner.type
                      : jobEntity.runner?.type) || 'None'
                  )
                    .split('/')
                    .at(-1)}`}
                >
                  <Button
                    disabled={[JobStatus.Starting, JobStatus.Running].includes(
                      // @ts-ignore
                      status
                    )}
                    onClick={() => setTemplateMenuIsOpen(true)}
                    variant='ghost_icon'
                  >
                    <Icon data={gear} size={24} />
                  </Button>
                </Tooltip>
                <TemplateMenu
                  templates={internalConfig.runnerTemplates || []}
                  onSelect={(template: TTemplate) =>
                    handleRunnerTemplateSelect(template)
                  }
                  onClose={() => setTemplateMenuIsOpen(false)}
                  isOpen={isTemplateMenuOpen}
                  title='Runner'
                  selected={templates.findIndex((template: TJobHandler) =>
                    _.isEqual(template, jobEntity.runner)
                  )}
                />
              </div>
            )}
        </JobButtonWrapper>

        {status === JobStatus.Running && progress !== null && (
          <div className='px-4 pb-2'>
            <Progress progress={progress} />
          </div>
        )}
      </div>
    </div>
  )
}

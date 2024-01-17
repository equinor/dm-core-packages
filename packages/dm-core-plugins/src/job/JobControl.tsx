import {
  EBlueprint,
  ErrorResponse,
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  TJobHandler,
  TRecurringJob,
  TSchedule,
  TTemplate,
  TemplateMenu,
  useDMSS,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import { Button, Chip, Icon, Tooltip } from '@equinor/eds-core-react'
import { gear } from '@equinor/eds-icons'
import { AxiosError } from 'axios'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  ConfigureRecurring,
  JobButtonWrapper,
  JobLog,
  Progress,
  getControlButton,
  getVariant,
} from './common'
import { scheduleTemplate } from './templateEntities'

type TJobControlConfig = {
  hideLogs?: boolean
  runnerTemplates?: TTemplate[]
}

const defaultConfig: TJobControlConfig = {
  hideLogs: false,
}

export const JobControl = (props: IUIPlugin) => {
  const { idReference, config } = props
  const dmssAPI = useDMSS()

  const internalConfig: TJobControlConfig = { ...defaultConfig, ...config }
  const {
    document: jobEntity,
    isLoading,
    updateDocument,
    error: jobEntityError,
  } = useDocument<TJob | TRecurringJob>(idReference, 0, false)

  const [asCronJob, setAsCronJob] = useState<boolean>(false)
  const [schedule, setSchedule] = useState<TSchedule>(scheduleTemplate())
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
  const [templates, setTemplates] = useState<any[]>([])

  const {
    start,
    error,
    logs,
    progress,
    status,
    remove,
    isLoading: jobIsLoading,
  } = useJob(idReference, jobEntity?.uid)

  useEffect(() => {
    if (!jobEntity) return
    if (asCronJob || jobEntity.type === EBlueprint.RECURRING_JOB)
      setSchedule((jobEntity as TRecurringJob)?.schedule)
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

  if (error || jobEntityError)
    throw new Error(JSON.stringify(error || jobEntityError, null, 2))

  return (
    <>
      {jobEntity.type === EBlueprint.RECURRING_JOB && (
        <ConfigureRecurring
          asCron={asCronJob}
          setAsCron={setAsCronJob}
          readOnly={true}
          schedule={schedule}
          registered={status === JobStatus.Registered}
        />
      )}
      <JobButtonWrapper>
        {getControlButton(status, remove, start, false, jobIsLoading)}
        {!internalConfig.hideLogs && <JobLog logs={logs} error={error} />}
        <Chip variant={getVariant(status)}>{status ?? 'Not registered'}</Chip>
        {internalConfig.runnerTemplates?.length && (
          <div className={'flex flex-row items-center'}>
            <Tooltip
              title={`Change runner. Current: ${jobEntity.runner?.type
                .split('/')
                .at(-1)}`}
            >
              <Button
                onClick={() => setTemplateMenuIsOpen(true)}
                variant='ghost_icon'
              >
                <Icon data={gear} size={24} />
              </Button>
            </Tooltip>
            <TemplateMenu
              templates={internalConfig.runnerTemplates || []}
              onSelect={(template: TTemplate) => {
                dmssAPI
                  .documentGet({ address: template.path })
                  .then((response) => {
                    const templateEntity: TJobHandler =
                      response.data as TJobHandler
                    updateDocument(
                      { ...jobEntity, runner: templateEntity },
                      false
                    ).catch((error: AxiosError<ErrorResponse>) => {
                      console.error(error)
                      toast.error(error.response?.data.message)
                    })
                  })
                  .catch((error: AxiosError<ErrorResponse>) => {
                    console.error(error)
                    toast.error(error.response?.data.message)
                  })
              }}
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
        <Progress progress={progress} />
      )}
    </>
  )
}

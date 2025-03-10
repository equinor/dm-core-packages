import {
  resolveRelativeAddressSimplified,
  useApplication,
} from '@development-framework/dm-core'
import { useContext, useMemo } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'

import {
  EBlueprint,
  type ErrorResponse,
  type IUIPlugin,
  JobStatus,
  type TJob,
  type TRecurringJob,
  type TSchedule,
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
import { useEffect, useState } from 'react'

import type { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { Stack, type TTemplate, TemplateMenu } from '../common'
import {
  ConfigureRecurring,
  JobLog,
  JobWrapper,
  Progress,
  type TCronValues,
  getControlButton,
  getVariant,
  parseCronStringToCronValues,
  parseCronValuesToCronString,
} from './common'
import {
  defaultCronValues,
  getRecurringJobTemplate,
  scheduleTemplate,
} from './templateEntities'

interface TJobPluginConfig {
  jobTargetAddress: string
  jobInputAddress?: string
  recurring?: boolean
  label: string
  showGetResult?: boolean
  jobTemplates: TTemplate[]
  hideLogs?: boolean
  title?: string
}

export const JobCreate = (props: IUIPlugin & { config: TJobPluginConfig }) => {
  const {
    config,
    idReference,
  }: { config: TJobPluginConfig; idReference: string } = props
  const { dmssAPI } = useApplication()
  const { tokenData } = useContext(AuthContext)
  const username = tokenData?.preferred_username ?? 'unknown user'

  const jobTargetAddress = useMemo(
    (): string =>
      resolveRelativeAddressSimplified(config.jobTargetAddress, idReference),
    [config]
  )

  if (config.jobTemplates.length < 1)
    throw new Error(
      "This plugin requires minimum one template to be defined in recipe config 'jobTemplates[]' "
    )

  const [asCronJob, setAsCronJob] = useState<boolean>(config.recurring ?? false)
  const [schedule, setSchedule] = useState<TSchedule>(scheduleTemplate())
  const [cronValues, setCronValues] = useState<TCronValues>(defaultCronValues())
  const [isTemplateMenuOpen, setTemplateMenuIsOpen] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0)

  const { document: jobDocument, updateDocument } = useDocument<
    TJob | TRecurringJob
  >(jobTargetAddress, 0, false)

  const {
    start,
    error,
    logs,
    progress,
    status,
    remove: deregister,
    isLoading: jobIsLoading,
  } = useJob(jobTargetAddress, jobDocument?.uid)

  useEffect(() => {
    if (!jobDocument) return
    if (asCronJob || jobDocument.type === EBlueprint.RECURRING_JOB)
      // @ts-ignore
      setSchedule(jobDocument.schedule?.cron ? jobDocument?.schedule : schedule)
    if (jobDocument.type === EBlueprint.RECURRING_JOB) setAsCronJob(true)
  }, [jobDocument])

  function createAndStartJob() {
    let templateAddress = ''
    let inputAddress = ''
    try {
      templateAddress = resolveRelativeAddressSimplified(
        config.jobTemplates[selectedTemplate].path,
        idReference
      )
      if (config.jobInputAddress)
        inputAddress = resolveRelativeAddressSimplified(
          config.jobInputAddress,
          idReference
        )
    } catch (e) {
      console.log(e)
      toast.error(e.message)
      return
    }

    // Get template
    dmssAPI
      .documentGet({
        address: templateAddress,
      })
      .then((response: AxiosResponse<object, any>) => {
        let newJob = response.data as TJob
        newJob.outputTarget = newJob.outputTarget
          ? resolveRelativeAddressSimplified(newJob.outputTarget, idReference)
          : undefined
        if (config.jobInputAddress)
          newJob.applicationInput = {
            type: 'dmss://system/SIMOS/Reference',
            address: inputAddress,
            referenceType: 'link',
          }
        if (asCronJob) {
          newJob = getRecurringJobTemplate(
            newJob,
            schedule,
            username,
            config.label
          )
        }
        //  If job entity exists, update it and start
        if (jobDocument) {
          updateDocument(newJob, false).then(() => start())
        } else {
          // Add template to job container
          dmssAPI
            .documentAdd({
              address: jobTargetAddress,
              document: JSON.stringify(newJob),
            })
            // Start the job
            .then(() => start())
            .catch((error: AxiosError<ErrorResponse>) => {
              console.error(error.response?.data)
              toast.error('Failed to create job. See console for details')
            })
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error.response?.data)
        toast.error('Failed to create job. See console for details')
      })
  }

  return (
    <div className='dm-plugin-padding'>
      <JobWrapper>
        {config.title && <Typography variant='h6'>{config.title}</Typography>}
        {config.recurring !== false && (
          <ConfigureRecurring
            asCron={asCronJob}
            setAsCron={setAsCronJob}
            readOnly={true}
            schedule={schedule}
            setSchedule={(s: TSchedule) => {
              setSchedule(s)
              setCronValues(parseCronStringToCronValues(s.cron))
            }}
            cronValues={cronValues}
            setCronValues={(c: TCronValues) => {
              setSchedule({ ...schedule, cron: parseCronValuesToCronString(c) })
              setCronValues(c)
            }}
            registered={status === JobStatus.Registered}
          />
        )}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack direction='row' alignItems='center' spacing={0.5}>
            {getControlButton(
              status,
              deregister,
              createAndStartJob,
              false,
              jobIsLoading
            )}
            <Stack direction='row' alignItems='center'>
              <Typography token={{ fontSize: '0.75rem' }}>Status:</Typography>
              <Chip variant={getVariant(status)} data-testid={'jobStatus'}>
                {status ?? 'Not registered'}
              </Chip>
            </Stack>
            {!config.hideLogs && <JobLog logs={logs} error={error} />}
          </Stack>
          {config.jobTemplates.length > 1 && (
            <Stack>
              <Tooltip title={`Change Job template. Current: `}>
                <Button
                  onClick={() => setTemplateMenuIsOpen(true)}
                  variant='ghost_icon'
                  disabled={[JobStatus.Starting, JobStatus.Running].includes(
                    // @ts-ignore
                    status
                  )}
                >
                  <Icon data={gear} size={24} />
                </Button>
              </Tooltip>
              <TemplateMenu
                templates={config.jobTemplates || []}
                onSelect={(_: any, index: number) => setSelectedTemplate(index)}
                onClose={() => setTemplateMenuIsOpen(false)}
                isOpen={isTemplateMenuOpen}
                title='Job template'
                selected={selectedTemplate}
              />
            </Stack>
          )}
        </Stack>
        {status === JobStatus.Running && progress !== null && (
          <Progress progress={progress} />
        )}
      </JobWrapper>
    </div>
  )
}

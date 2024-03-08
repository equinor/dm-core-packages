import {
  resolveRelativeAddressSimplified,
  useApplication,
} from '@development-framework/dm-core'
import { useContext, useMemo } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'

import {
  EBlueprint,
  ErrorResponse,
  IUIPlugin,
  JobStatus,
  TJob,
  TRecurringJob,
  TSchedule,
  TTemplate,
  TemplateMenu,
  useDocument,
  useJob,
} from '@development-framework/dm-core'
import { Button, Chip, Icon, Tooltip } from '@equinor/eds-core-react'
import { gear } from '@equinor/eds-icons'
import { useEffect, useState } from 'react'

import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
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

  useEffect(() => {
    if (!jobDocument) return
    if (asCronJob || jobDocument.type === EBlueprint.RECURRING_JOB)
      // @ts-ignore
      setSchedule(jobDocument.schedule?.cron ? jobDocument?.schedule : schedule)
    if (jobDocument.type === EBlueprint.RECURRING_JOB) setAsCronJob(true)
  }, [jobDocument])
  return (
    <div className={'flex-col'}>
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
      <JobButtonWrapper>
        {getControlButton(
          status,
          deregister,
          createAndStartJob,
          false,
          jobIsLoading
        )}
        {!config.hideLogs && <JobLog logs={logs} error={error} />}
        <Chip variant={getVariant(status)}>{status ?? 'Not registered'}</Chip>
        {config.jobTemplates.length > 1 && (
          <div className={'flex flex-row items-center'}>
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
          </div>
        )}
      </JobButtonWrapper>
      {status === JobStatus.Running && progress !== null && (
        <Progress progress={progress} />
      )}
    </div>
  )
}

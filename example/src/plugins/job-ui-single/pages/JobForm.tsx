import {
  EBlueprint,
  TJob,
  Stack,
  useBlueprint,
  Loading,
  TAttribute,
  EntityPickerButton,
  JobStatus,
  BlueprintPicker,
  TJobHandler,
  TContainerJobHandler,
} from '@development-framework/dm-core'
import { Button, TextField } from '@equinor/eds-core-react'

import React, { useState } from 'react'

export const JobForm = (props: {
  onSubmit: (job: TJob) => void
  applicationInputType: string
  jobRunnerType: string
}) => {
  const defaultJobValues: TJob & {
    runner: TJobHandler | TContainerJobHandler
  } = {
    type: EBlueprint.JOB,
    runner: { type: props.jobRunnerType } as TJobHandler,
    status: JobStatus.NotStarted,
    started: 'Not started',
  }
  const [formData, setFormData] = useState<
    TJob & {
      runner: TJobHandler | TContainerJobHandler
    }
  >(defaultJobValues)
  const {
    blueprint: jobBlueprint,
    isLoading: isBlueprintLoading,
    error,
  } = useBlueprint(EBlueprint.JOB)

  if (isBlueprintLoading) {
    return <Loading />
  }
  if (error) {
    throw new Error('Could not load Job blueprint')
  }
  return (
    <div>
      <Stack spacing={1}>
        {jobBlueprint.attributes.map((attribute: TAttribute) => {
          if (attribute.name === 'runner') {
            return (
              <>
                <BlueprintPicker
                  label={'Select type for runner'}
                  onChange={(selectedType) => {
                    selectedType = 'dmss://' + selectedType
                    setFormData({
                      ...formData,
                      runner: { ...formData.runner, type: selectedType },
                    })
                  }}
                  formData={''} //TODO fix bug: for some reason the app crashes is using formData.runner.type here...
                />
                {formData.runner.type ?? (
                  <p>Selected runner type: {formData.runner.type} </p>
                )}
              </>
            )
          }
          if (attribute.name === 'applicationInput') {
            return (
              <>
                <p>Select reference to applicationInput</p>
                <EntityPickerButton
                  returnLinkReference={true}
                  onChange={(linkReferenceEntity) => {
                    setFormData({
                      ...formData,
                      applicationInput: linkReferenceEntity,
                    })
                  }}
                />
                <p>
                  Selected applicationInput:{' '}
                  {formData?.applicationInput
                    ? JSON.stringify(formData.applicationInput.address)
                    : 'None'}
                </p>
              </>
            )
          }
          if (attribute.optional) {
            return <></>
          }

          return (
            <>
              <TextField
                id={attribute.name}
                type={attribute.type === 'number' ? 'number' : 'string'}
                label={
                  attribute.name + (attribute.optional ? ' (optional)' : '')
                }
                value={formData[attribute.name]}
              />
            </>
          )
        })}
        <Button onClick={() => props.onSubmit(formData)}>Submit</Button>
      </Stack>
    </div>
  )
}

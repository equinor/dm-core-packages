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
  TJobWithRunner,
} from '@development-framework/dm-core'
import { Button, TextField } from '@equinor/eds-core-react'

import React, { ChangeEvent, useState } from 'react'

/**
 * A component for creating an entity of type Job.
 *
 * This component depends on the Job blueprint in dm-job. If the blueprint changes, this component might have to be updated.
 * The form consists of regular input fields for primitive blueprint attributes, but 'runner' and 'applicationInput' must be handled differently.
 * The user must select type for the 'runner' with a BlueprintPicker, and the user must select a reference to use as 'applciationInput'.
 *
 * @param onSubmit Function to run when Job is submitted.
 * @param jobRunnerType Type of job runner to add to the Job entity (for example dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob)
 * @param applicationInputType Type of applicationInput to add to the Job entity.

 */
export const JobForm = (props: {
  onSubmit: (job: TJob) => void
  applicationInputType: string
  jobRunnerType: string
  defaultJobOutputTarget?: string
}) => {
  const defaultJobValues: TJobWithRunner = {
    type: EBlueprint.JOB,
    runner: { type: props.jobRunnerType } as TJobHandler,
    status: JobStatus.NotStarted,
    outputTarget: props.defaultJobOutputTarget ?? '',
    started: 'Not started',
  }
  const [formData, setFormData] = useState<TJobWithRunner>(defaultJobValues)
  const {
    blueprint: jobBlueprint,
    isLoading: isBlueprintLoading,
    error,
  } = useBlueprint(EBlueprint.JOB)

  const attributesToSkip = [
    'type',
    'uid',
    'started',
    'ended',
    'stopped',
    'status',
    'result',
    'referenceTarget',
  ]
  const filteredBlueprintAttributes = jobBlueprint
    ? jobBlueprint.attributes.filter(
        (attribute: TAttribute) => !attributesToSkip.includes(attribute.name)
      )
    : []
  if (isBlueprintLoading) {
    return <Loading />
  }
  if (error) {
    throw new Error('Could not load Job blueprint')
  }
  return (
    <div>
      <Stack spacing={1}>
        {filteredBlueprintAttributes.map((attribute: TAttribute) => {
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
                  formData={formData.runner.type}
                />
              </>
            )
          }
          if (attribute.name === 'applicationInput') {
            return (
              <>
                <div>
                  <p>Select reference to applicationInput</p>
                  <p>
                    {formData?.applicationInput &&
                      'Selected: ' +
                        JSON.stringify(formData.applicationInput.address)}
                  </p>
                </div>
                <EntityPickerButton
                  returnLinkReference={true}
                  onChange={(linkReferenceEntity) => {
                    setFormData({
                      ...formData,
                      applicationInput: linkReferenceEntity,
                    })
                  }}
                />
              </>
            )
          }

          return (
            <>
              <TextField
                id={attribute.name}
                type={attribute.type === 'number' ? 'number' : 'string'}
                label={
                  attribute.name + (attribute.optional ? ' (optional)' : '')
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFormData({
                    ...formData,
                    [attribute.name]: event.target.value,
                  })
                }}
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

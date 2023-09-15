import {
  EBlueprint,
  EntityPickerDialog,
  JobStatus,
  Loading,
  Stack,
  TAttribute,
  TJob,
  TLinkReference,
  TValidEntity,
  useBlueprint,
} from '@development-framework/dm-core'
import {Button, TextField, Typography} from '@equinor/eds-core-react'

import React, { ChangeEvent, useState } from 'react'

/**
 * A component for creating an entity of type Job.
 *
 * This component depends on the Job blueprint in dm-job. If the blueprint changes, this component might have to be updated.
 * The form consists of regular input fields for primitive blueprint attributes, but 'runner' and 'applicationInput' must be handled differently.
 * The user must select type for the 'runner' with a BlueprintPicker, and the user must select a reference to use as 'applciationInput'.
 *
 * @param onSubmit Function to run when Job is submitted.
 * @param defaultJobOutputTarget An optional value for outputTarget in the job entity to create. This value is used in the job handler to specify where results of the job should be uploaded/inserted.

 */
export const JobForm = (props: {
  onSubmit: (job: TJob) => void
  defaultJobOutputTarget?: string
}) => {
  const defaultJobValues: TJob = {
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    outputTarget: props.defaultJobOutputTarget ?? '',
    started: 'Not started',
  }
  const [formData, setFormData] = useState<TJob>(defaultJobValues)
  const [showJobRunnerModal, setShowJobRunnerModal] = useState<boolean>(false)
  const [showInputModal, setShowInputModal] = useState<boolean>(false)
  const {
    blueprint: jobBlueprint,
    isLoading: isBlueprintLoading,
    error,
  } = useBlueprint(EBlueprint.JOB)

  const jobAttributesToSkip = [
    'type',
    'uid',
    'started',
    'ended',
    'stopped',
    'status',
    'result',
    'referenceTarget',
  ]

  const filteredJobBlueprintAttributes = jobBlueprint
    ? jobBlueprint.attributes.filter(
        (attribute: TAttribute) => !jobAttributesToSkip.includes(attribute.name)
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
        {filteredJobBlueprintAttributes.map((attribute: TAttribute) => {
          if (attribute.name === 'runner') {
            return (
              <>
                <Typography>Pick job runner entity:</Typography>
                <Button onClick={() => setShowJobRunnerModal(true)}>
                  Select
                </Button>
                <EntityPickerDialog
                  showModal={showJobRunnerModal}
                  setShowModal={setShowJobRunnerModal}
                  onChange={(address: string, entity?: TValidEntity) => {
                    setFormData({ ...formData, runner: entity })
                  }}
                />
                <Typography>
                  {formData?.runner &&
                    'Selected: ' + JSON.stringify(formData.runner)}
                </Typography>
              </>
            )
          }
          if (attribute.name === 'applicationInput') {
            return (
              <>
                <div>
                  <Typography>Select reference to applicationInput</Typography>
                  <Typography>
                    {formData?.applicationInput &&
                      'Selected: ' +
                        JSON.stringify(formData.applicationInput.address)}
                  </Typography>
                </div>
                <Button onClick={() => setShowInputModal(true)}>Select</Button>
                <EntityPickerDialog
                  showModal={showInputModal}
                  setShowModal={setShowInputModal}
                  onChange={(address: string) => {
                    const linkReference: TLinkReference = {
                      type: EBlueprint.REFERENCE,
                      referenceType: 'link',
                      address: address,
                    }
                    setFormData({
                      ...formData,
                      applicationInput: linkReference,
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
        <Button
          disabled={!formData?.applicationInput || !formData?.runner}
          onClick={() => props.onSubmit(formData)}
        >
          Submit
        </Button>
      </Stack>
    </div>
  )
}

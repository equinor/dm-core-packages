import {
  AuthContext,
  DmssAPI,
  EBlueprint,
  ErrorResponse,
  TJob,
  TGenericObject,
  Stack,
  getDataSourceIdFromReference,
} from '@development-framework/dm-core'
import { Button, TextField } from '@equinor/eds-core-react'
import React, { ChangeEvent, useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { JobForm } from './JobForm'

type TCreateJobEntityProps = {
  jobEntityDestination: string
  applicationInputType: string
  jobRunnerType: string
  defaultJobEntity?: TJob
  onCreate: (jobEntityId: string) => void
  defaultJobOutputTarget?: string
}

/**
 * A component for creating a Job entity.
 *
 * If the defaultJobEntity is included as props, this is the entity that will be uplaoded to DMSS when clicking on Create.
 * If the defaultJobEntity is NOT included, a form is used to create input fields to let the user create the job entity.
 *
 *

 * @param jobEntityDestination Where job entity will be uploaded. Must be an address, either to a Package (PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE) or to an attribute inside an object (PROTOCOL://DATA SOURCE/$123-123-123.list[2].job).
 * @param onCreate Function to run when Job entity is created.
 * @param jobRunnerType Type of job runner to add to the Job entity (for example dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob)
 * @param applicationInputType Type of applicationInput to add to the Job entity.
 * @param defaultJobEntity An optional default entity.
 */
export const CreateJobEntity = (props: TCreateJobEntityProps) => {
  const {
    jobEntityDestination,
    onCreate,
    jobRunnerType,
    defaultJobEntity,
    applicationInputType,
    defaultJobOutputTarget,
  } = props

  const { token } = useContext(AuthContext)
  const DmssApi = new DmssAPI(token)
  const destinationIsAPackage: boolean = !(
    jobEntityDestination.includes('.') || jobEntityDestination.includes('[')
  )
  const dataSourceId: string =
    getDataSourceIdFromReference(jobEntityDestination)
  const [createdJobEntity, setCreatedJobEntity] = useState<TGenericObject>()
  const [jobOutputTarget, setJobOutputTarget] = useState<string>(
    defaultJobOutputTarget ?? ''
  )
  const createJobEntity = (jobEntityFormData: TJob) => {
    jobEntityFormData = {
      ...jobEntityFormData,
      outputTarget: jobOutputTarget,
    }
    if (destinationIsAPackage) {
      DmssApi.documentAdd({
        address: jobEntityDestination,
        document: JSON.stringify(jobEntityFormData),
      })
        .then((response: AxiosResponse) => {
          onCreate(`${dataSourceId}/$${response.data.uid}`)
          setCreatedJobEntity(jobEntityFormData)
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error.response?.data)
        })
    } else {
      DmssApi.documentUpdate({
        idAddress: jobEntityDestination,
        data: JSON.stringify(jobEntityFormData),
      })
        .then((response: AxiosResponse<any>) => {
          onCreate(jobEntityDestination)
          setCreatedJobEntity(jobEntityFormData)
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error.response?.data)
        })
    }
  }

  if (createdJobEntity) {
    return (
      <>
        <p>Job entity already created at location {jobEntityDestination} </p>
      </>
    )
  }

  return (
    <div>
      <Stack spacing={1}>
        <h3>Create new object of type: {EBlueprint.JOB}</h3>
        {/*// todo maybe replace with DestinationPicker later??? functionality of DestinationPicker must then be updated to be able to select attribute inside entities.*/}
        <TextField
          id={'jobOutputTarget'}
          type={'string'}
          label={'select where to put result from job (reference)'}
          value={jobOutputTarget}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setJobOutputTarget(event.target.value)
          }}
        />
        {defaultJobEntity ? (
          <>
            <p>
              Using default job entity. Will be saved to destination{' '}
              {jobEntityDestination}
            </p>
            <Button
              onClick={() => {
                createJobEntity(defaultJobEntity)
              }}
            >
              Create
            </Button>
          </>
        ) : (
          <JobForm
            onSubmit={(jobEntityFormData: TJob) => {
              createJobEntity(jobEntityFormData as TJob)
            }}
            applicationInputType={applicationInputType}
            jobRunnerType={jobRunnerType}
          />
        )}
      </Stack>
    </div>
  )
}

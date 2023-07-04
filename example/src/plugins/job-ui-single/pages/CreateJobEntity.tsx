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
import { Button } from '@equinor/eds-core-react'
import React, { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { JobForm } from './JobForm'

type TCreateJobEntityProps = {
  jobEntityDestination: string
  applicationInputType: string
  jobRunnerType: string
  defaultJobEntity?: TJob
  onCreate: (jobEntityId: string) => void
}

/**
 * A component for creating an entity of type Job.
 *
 * If the defaultJobEntity is included as props, this is the entity that will be uplaoded to DMSS when clicking on Save.
 * If the defaultJobEntity is NOT included, a form is used to create input fields to let the user create the job entity.
 *
 *

 * @param jobEntityDestination Where job entity should be uploaded. Must be an address, either to a Package (PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE) or to an attribute inside an object (PROTOCOL://DATA SOURCE/$123-123-123.list[2].job).
 * @param onCreate Function to run when Job entity is created.
 * @param jobRunnerType Type of job runner to add to the Job entity (for example dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob)
 * @param defaultJobEntity An optional default entity.
 */
export const CreateJobEntity = (props: TCreateJobEntityProps) => {
  const {
    jobEntityDestination,
    onCreate,
    jobRunnerType,
    defaultJobEntity,
    applicationInputType,
  } = props

  const { token } = useContext(AuthContext)
  const [createdJobEntity, setCreatedJobEntity] = useState<TGenericObject>()

  const DmssApi = new DmssAPI(token)
  const destinationIsAPackage = !(
    jobEntityDestination.includes('.') || jobEntityDestination.includes('[')
  )
  const dataSourceId = getDataSourceIdFromReference(jobEntityDestination)

  const saveJobEntity = (jobEntityFormData: TJob) => {
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
        <h2>Create new object of type: {EBlueprint.JOB}</h2>
        {defaultJobEntity ? (
          <>
            <p>
              Using default job entity. Will be saved to destination{' '}
              {jobEntityDestination}
            </p>
            <Button
              onClick={() => {
                saveJobEntity(defaultJobEntity)
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <JobForm
            onSubmit={(jobEntityFormData: TJob) => {
              saveJobEntity(jobEntityFormData as TJob)
            }}
            applicationInputType={applicationInputType}
            jobRunnerType={jobRunnerType}
          />
        )}
      </Stack>
    </div>
  )
}

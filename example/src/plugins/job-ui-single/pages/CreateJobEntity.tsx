import {
  EBlueprint,
  ErrorResponse,
  Stack,
  TGenericObject,
  TJob,
  splitAddress,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Card, Typography } from '@equinor/eds-core-react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { JobForm } from './JobForm'

type TCreateJobEntityProps = {
  jobEntityDestination: string
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
 * @param defaultJobEntity An optional default entity.
 * @param defaultJobOutputTarget An optional value for outputTarget in the job entity to create. This value is used in the job handler to specify where results of the job should be uploaded/inserted.
 */
export const CreateJobEntity = (props: TCreateJobEntityProps) => {
  const {
    jobEntityDestination,
    onCreate,
    defaultJobEntity,
    defaultJobOutputTarget,
  } = props

  const DmssApi = useDMSS()
  const { dataSource: dataSourceId } = splitAddress(jobEntityDestination)
  const [createdJobEntity, setCreatedJobEntity] = useState<TGenericObject>()

  const createJobEntity = (jobEntityFormData: TJob) => {
    if (defaultJobOutputTarget && !jobEntityFormData.outputTarget) {
      jobEntityFormData = {
        ...jobEntityFormData,
        outputTarget: defaultJobOutputTarget,
      }
    }

    const updateDocument = (
      jobEntityDestination: string,
      jobEntityFormData: TJob
    ) => {
      DmssApi.documentUpdate({
        idAddress: jobEntityDestination,
        data: JSON.stringify(jobEntityFormData),
      })
        .then(() => {
          onCreate(jobEntityDestination)
          setCreatedJobEntity(jobEntityFormData)
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          console.error(error.response?.data)
        })
    }

    const addDocument = (
      jobEntityDestination: string,
      jobEntityFormData: TJob
    ) => {
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
    }

    const addOrUpdateDocument = (
      jobExists: boolean,
      jobEntityDestination: string,
      jobEntityFormData: TJob
    ) => {
      if (jobExists) {
        updateDocument(jobEntityDestination, jobEntityFormData)
      } else {
        addDocument(jobEntityDestination, jobEntityFormData)
      }
    }

    // TODO: Implement document check
    DmssApi.documentCheck({
      address: jobEntityDestination,
    }).then((response: AxiosResponse) =>
      addOrUpdateDocument(
        response.data,
        jobEntityDestination,
        jobEntityFormData
      )
    )
  }

  // Not sure if we need to show a message about existing jobs, should suffice with the proper UI controls?
  // if (createdJobEntity) {
  //   return (
  //     <Card variant="info" style={{ marginBottom: '1rem' }}>
  //       <Card.Header>
  //         <Typography variant="h6">Existing job</Typography>
  //       </Card.Header>
  //       <Card.Content>
  //         <Typography>
  //           A job with this ID already exists at location{' '}
  //           <span style={{ fontWeight: 500 }}>{jobEntityDestination}</span>
  //         </Typography>
  //       </Card.Content>
  //     </Card>
  //   )
  // }
  if (createdJobEntity) return <></>

  return (
    <div>
      <Stack spacing={1}>
        <h3>Create new object of type: {EBlueprint.JOB}</h3>
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
            defaultJobOutputTarget={defaultJobOutputTarget}
          />
        )}
      </Stack>
    </div>
  )
}

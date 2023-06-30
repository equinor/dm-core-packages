import {
  EBlueprint,
  JobStatus,
  TJob,
  IUIPlugin,
} from '@development-framework/dm-core'
import React, { useState } from 'react'

import { JobControl } from './JobControl'
import { CreateJobEntity } from './CreateJobEntity'

export const JobPlugin = (props: IUIPlugin) => {
  // TODO make this plugin general and move to dm-core-packages/packages/dm-core-plugins. Right now, it can only be used in the SignalApp due to hard coded values.

  const [jobEntityId, setJobEntityId] = useState<string>('')
  const jobEntityDestination = `DemoDataSource/$4483c9b0-d505-46c9-a157-94c79f4d7a6a.study.cases[0].job`

  // Example of another value for jobEntityDestination
  // const jobEntityDestination = `DemoDataSource/apps/MySignalApp/instances`

  // example of a default job entity
  const defaultJobEntity: TJob = {
    label: 'Example local container job',
    type: EBlueprint.JOB,
    status: JobStatus.NotStarted,
    triggeredBy: 'me',
    applicationInput: {
      type: EBlueprint.REFERENCE,
      referenceType: 'link',
      address: 'dmss://DemoDataSource/$5483c9b0-d505-46c9-a157-94c79f4d7a6b',
    },
    runner: {
      type: `dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob`,
    },
    started: 'Not started',
  }

  return (
    <div>
      {/*// TODO do not include CreateJobEntity component if entity exists in destination*/}
      {/*TODO have a way to check if an entity of type job already exists in 'jobEntityDestination'. Must scan content of entire package if jobEntityDestination is a package, but its simpler to check if jobEntityDestination is refering to an object's attribute. */}
      <CreateJobEntity
        jobEntityDestination={jobEntityDestination}
        applicationInputType={`dmss://DemoDataSource/apps/MySignalApp/models/CaseProxy`}
        jobRunnerType={`dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob`}
        onCreate={(jobEntityId: string) => setJobEntityId(jobEntityId)}
      />
      {jobEntityId && <JobControl jobEntityId={jobEntityId} />}
    </div>
  )
}

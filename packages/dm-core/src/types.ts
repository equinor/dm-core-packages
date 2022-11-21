import { JobStatus } from './services/api/configs/gen-job'
import { EPluginType, IUIPlugin } from './context/UiPluginContext'
import React from 'react'

export type TDataSource = {
  id: string
  name: string
  type?: string
  host?: string
}

export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TBlob = {
  _blob_id?: string
  name: string
  type: string
}

export type TLocation = {
  lat: number
  long: number
  name: string
  label?: string
  _id?: string
  type?: string
}

export type TContainerImage = {
  _id?: string
  uid?: string
  imageName: string
  description?: string
  type: string
  version: string
  registryName: string
}

export type TGenericObject = {
  [key: string]: any
}

export type TSTaskBody = {
  type: string
  name: string
  blob: TBlob
}

export type TContainer = {
  label?: string
  image: TContainerImage
  customCommand?: string
}

export type TChildTab = {
  attribute: string
  entity: any
  categories?: string[]
  absoluteDottedId: string
  onSubmit: (data: any) => void
}

export type TRunner = { image?: any; type: string }

export type TTaskFormData = {
  applicationInput?: TGenericObject
  runner?: TRunner
  type?: string
  outputType?: string
  inputType?: string
  description?: string
  label?: string
  name?: string
}

//Represents JobHandler blueprint from WorkflowDS/Blueprints/jobHandlers/JobHandler.json
export type TJobHandler = {
  type: string
  environmentVariables?: string[]
}

//Represents Container blueprint from WorkflowDS/Blueprints/jobHandlers/Container.json
export type TContainerJobHandler = {
  type: string
  label?: string
  image: string
  command: string[]
  environmentVariables?: string[]
}

export type TJob = {
  _id?: string
  label: string
  type: string
  status: JobStatus
  triggeredBy: string
  applicationInput: TReference
  runner: TJobHandler | TContainerJobHandler
  started: string
  name?: string
  uid?: string
  result?: any
  ended?: string
  outputTarget?: string
  referenceTarget?: string
}

export type TLocalContainerJob = {
  type: string
  name: string
  label?: string
  image: string
  command: string
  environmentVariables?: string[]
}

export type TCronJob = {
  cron: string
  startDate: Date
  endDate: Date
}

export type TValidEntity = {
  type: string
  [key: string]: any
}

export type TPlugin = {
  pluginName: string
  pluginType: EPluginType
  component: React.FC<IUIPlugin>
}

export type TUserIdMapping = { userId: string; username: string }

import type { EBlueprint } from './Enums'
import type { JobStatus } from './services/api/configs/gen-job'

export type TDataSource = {
  id: string
  name: string
  type?: string
  host?: string
}

export type TRole = {
  name: string
  label: string
  authServerRoleName: string
}

export type TApplication = {
  name: string
  type: string
  dataSources?: string[]
  label?: string
  description?: string
  roles?: TRole[]
}

export type TAttribute = {
  name: string
  type: string
  attributeType: string
  ensureUID?: boolean
  dimensions?: string
  optional?: boolean
  contained?: boolean
  description?: string
  label?: string
  enumType?: string
  default?: any
}

export type TBlueprint = {
  name: string
  type: string
  description?: string
  extends?: string[]
  attributes: TAttribute[]
  _meta_?: any[]
  abstract?: boolean
}

// TODO check if TReference is used instead of TLinkReference
export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TLinkReference = {
  type: 'dmss://system/SIMOS/Reference'
  referenceType: 'link'
  address: string
}

export type TStorageReference = {
  type: string
  referenceType: 'storage'
  address: string
}

export type TBlob = {
  _blob_id?: string
  name: string
  type: string
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

//Represents JobHandler blueprint from WorkflowDS/Blueprints/jobHandlers/JobHandler.json
export type TJobHandler = {
  type: string
  environmentVariables?: string[]
}

//Represents Container blueprint from WorkflowDS/Blueprints/jobHandlers/Container.json
export type TContainerJobHandler = {
  type: string
  label?: string
  image: TContainerImage
  name: string
  customCommand?: string
  environmentVariables?: string[]
}

export type TMeta = {
  type: EBlueprint.META
  version: string
  versionNote?: string
  dependencies: any[]
  createdBy?: string
  createdTimestamp?: string
  lastModifiedBy?: string
  lastModifiedTimestamp?: string
}

export type TJob = {
  _id?: string
  label?: string
  type: string
  status: JobStatus
  triggeredBy?: string
  applicationInput?: TGenericObject
  runner?: TJobHandler | TContainerJobHandler
  started?: string
  name?: string
  uid?: string
  result?: TGenericObject
  ended?: string
  outputTarget?: string
  referenceTarget?: string
}

export type TRecurringJob = TJob & {
  applicationInput: TJob
  schedule: TSchedule
}

export type TSchedule = {
  type: string
  cron: string
  startDate: string
  endDate: string
  runs: TJob[]
}

export type TJobWithRunner = TJob & {
  runner: TJobHandler | TContainerJobHandler
}

type TValidAttribute =
  | undefined
  | string
  | number
  | boolean
  | TValidEntity
  | TValidAttribute[]

export type TValidEntity = {
  type: string
  _meta_?: TMeta
  [key: string]: TValidAttribute
}

export type TPackage = {
  _id?: string
  name: string
  type: string
  isRoot: boolean
  content?: TStorageReference[]
  description?: string
}

export interface IUIPlugin {
  type: string
  idReference: string
  onSubmit?: (data: any) => void // Listen to submits
  onChange?: (data: any) => void // Listen to changes
  onOpen?: TOnOpen
  config?: any
  showRefreshButton?: boolean
}

export type TOnOpen = (
  viewId: string,
  view: TViewConfig | TReferenceViewConfig | TInlineRecipeViewConfig,
  rootId?: string,
  isSubItem?: boolean,
  onSubmit?: (data: any) => void,
  onChange?: (data: any) => void
) => void

export type TUiPluginMap = { [pluginName: string]: TPlugin }

export type TUiRecipe = {
  type: string
  name: string
  plugin: string
  description?: string
  showRefreshButton?: boolean
  category?: string
  config?: TGenericObject
  roles?: string[]
  dimensions?: string
}

export type TStorageRecipe = {
  name: string
  type: string
  attributes: any
  storageAffinity: string
  description: string
}

export type TPlugin = {
  component: (props: IUIPlugin) => React.ReactElement
}

export type TUserIdMapping = { userId: string; username: string }

// View config specific

export type TViewConfig = {
  type: string
  scope?: string
  resolve?: boolean
  label?: string
  eds_icon?: string
  roles?: string[]
  showRefreshButton?: boolean
  recipe?: string | TUiRecipe
}

export type TReferenceViewConfig = TViewConfig & {
  recipe: string
}

export type TInlineRecipeViewConfig = TViewConfig & {
  recipe: TUiRecipe
}

export type TFileEntity = {
  type: string
  name: string
  author: string
  date: string
  size: number
  filetype: string
  content?: TStorageReference
}

export type TEnum = {
  values: string[]
  labels: string[]
}

export function isViewConfig(
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
): viewConfig is TViewConfig {
  return viewConfig.type.split(/:|\//).at(-1) === 'ViewConfig'
}

export function isReferenceViewConfig(
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
): viewConfig is TReferenceViewConfig {
  return viewConfig.type.split(/:|\//).at(-1) === 'ReferenceViewConfig'
}

export function isInlineRecipeViewConfig(
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
): viewConfig is TInlineRecipeViewConfig {
  return viewConfig.type.split(/:|\//).at(-1) === 'InlineRecipeViewConfig'
}

import { JobStatus } from './services/api/configs/gen-job'

export type TDataSource = {
  id: string
  name: string
  type?: string
  host?: string
}

// TODO check if TReference is used instead of TLinkReference
export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TLinkReference = {
  type: string
  referenceType: 'link'
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
  image: string
  command: string[]
  environmentVariables?: string[]
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

export type TValidEntity = {
  type: string
  [key: string]: any
}

export interface IUIPlugin {
  type: string
  idReference: string
  onSubmit?: (data: any) => void
  onOpen?: (key: string, view: TViewConfig, rootId?: string) => void
  config?: any
}

export type TUiRecipe = {
  type: string
  name: string
  plugin: string
  description?: string
  category?: string
  config?: TGenericObject
  roles?: string[]
  dimensions?: string
}

export type TPlugin = {
  pluginName: string
  component: (props: IUIPlugin) => JSX.Element
}

export type TUserIdMapping = { userId: string; username: string }

// View config specific

export type TViewConfig = {
  type: string
  scope?: string
  label?: string
  eds_icon?: string
}

export type TReferenceViewConfig = TViewConfig & {
  recipe: string
}

export type TInlineRecipeViewConfig = TViewConfig & {
  recipe: TUiRecipe
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

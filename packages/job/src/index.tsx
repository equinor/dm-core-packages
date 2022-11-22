import * as React from 'react'

import {
  EPluginType,
  IUIPlugin,
  useDocument,
  TJob,
  Loading,
  TPlugin,
} from '@development-framework/dm-core'
import { JobControl } from './JobControl'
import { JobInputEdit } from './JobInputEdit'

const JobControlWrapper = (props: IUIPlugin) => {
  const { idReference } = props
  const [dataSourceId, documentId] = idReference.split('/', 2)
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    idReference
  )
  if (documentLoading) return <Loading />
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return <div>Something went wrong; {errorResponse}</div>
  }
  if (!document) return <div>The job document is empty</div>
  return (
    <JobControl
      document={document}
      jobId={`${dataSourceId}/${document}`} //TODO fix input: this will fail since document is of type TJob and not any
      updateDocument={updateDocument}
    />
  )
}

export const plugins: TPlugin[] = [
  {
    pluginName: 'jobControl',
    pluginType: EPluginType.UI,
    component: JobControlWrapper,
  },
  {
    pluginName: 'jobInputEdit',
    pluginType: EPluginType.UI,
    component: JobInputEdit,
  },
]

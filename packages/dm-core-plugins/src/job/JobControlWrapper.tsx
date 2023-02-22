import * as React from 'react'

import {
  IUIPlugin,
  useDocument,
  TJob,
  Loading,
} from '@development-framework/dm-core'
import {JobControl} from './JobControl'

export const JobControlWrapper = (props: IUIPlugin) => {
  const {idReference} = props
  const [dataSourceId, documentId] = idReference.split('/', 2)
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    idReference
  )
  if (documentLoading) return <Loading/>
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


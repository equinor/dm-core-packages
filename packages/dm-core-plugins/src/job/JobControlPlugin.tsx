import * as React from 'react'

import {
  IUIPlugin,
  useDocument,
  TJob,
  Loading,
} from '@development-framework/dm-core'
import { JobControl } from './JobControl'

export const JobControlPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const [dataSourceId, documentId] = idReference.split('/', 2)
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    idReference
  )
  if (documentLoading) return <Loading />
  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (!document) return <div>The job document is empty</div>
  return (
    <JobControl
      document={document}
      jobId={`${dataSourceId}/${document}`} //TODO fix input: this will fail since document is of type TJob and not any
      updateDocument={updateDocument}
    />
  )
}

import * as React from 'react'

import {
  IUIPlugin,
  useDocument,
  TJob,
  Loading,
  splitAddress,
} from '@development-framework/dm-core'
import { JobControl } from './JobControl'

export const JobControlPlugin = (props: IUIPlugin) => {
  const { idReference } = props

  const { dataSource } = splitAddress(idReference)
  const [document, documentLoading, updateDocument, error] =
    useDocument<TJob>(idReference)
  if (error) throw new Error(JSON.stringify(error, null, 2))
  if (documentLoading) return <Loading />
  if (!document) return <div>The job document is empty</div>
  return (
    <JobControl
      document={document}
      jobId={`${dataSource}/${document}`} //TODO fix input: this will fail since document is of type TJob and not any
      updateDocument={updateDocument}
    />
  )
}

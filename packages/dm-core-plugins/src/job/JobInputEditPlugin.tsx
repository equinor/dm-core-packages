import {
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  EntityView,
  useDocument,
  splitAddress,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {Typography} from "@equinor/eds-core-react";

export const JobInputEditPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const { dataSource } = splitAddress(idReference)
  const [document, documentLoading, updateDocument, error] =
    useDocument<TJob>(idReference)
  const [formData, setFormData] = useState<TJob | null>(null)

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  if (documentLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error, null, 2))

  if (!formData) return <div>The job document is empty</div>

  if (formData.status !== JobStatus.Registered) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
        }}
      >
        <Typography variant="body_short_bold">Can't edit job parameters after job has been started</Typography>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {Object.keys(formData.applicationInput || {}).length ? (
          <EntityView
            type={formData.applicationInput?.type}
            idReference={`${dataSource}/${formData.applicationInput?._id}`}
            onSubmit={(data: any) =>
              updateDocument({ ...formData, applicationInput: data }, true)
            }
          />
        ) : (
          <pre style={{ color: 'red' }}>
            The jobs has no value for the "applicationInput" attribute
          </pre>
        )}
      </div>
    </div>
  )
}

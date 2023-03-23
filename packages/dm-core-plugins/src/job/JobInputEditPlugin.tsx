import {
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  EntityView,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'

export const JobInputEditPlugin = (props: IUIPlugin) => {
  const { idReference } = props
  const [dataSourceId, documentId] = idReference.split('/', 2)
  const [document, documentLoading, updateDocument, error] = useDocument<TJob>(
    idReference
  )
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
        <h4>Can't edit job parameters after job has been started</h4>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {Object.keys(formData.applicationInput || {}).length ? (
          <EntityView
            type={formData.applicationInput.type}
            idReference={`${dataSourceId}/${formData.applicationInput._id}`}
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

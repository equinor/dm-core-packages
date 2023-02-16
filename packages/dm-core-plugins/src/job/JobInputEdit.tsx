import {
  IUIPlugin,
  JobStatus,
  Loading,
  TJob,
  UIPluginSelector,
  useDocument,
} from '@development-framework/dm-core'
import React, { useEffect, useState } from 'react'

export default (props: IUIPlugin) => {
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
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return (
      <div>
        <div>Something went wrong when fetching document: </div>
        {errorResponse}
      </div>
    )
  }
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
          <UIPluginSelector
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

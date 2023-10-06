import '@development-framework/dm-core/dist/main.css'
import {
  EntityView,
  FSTreeProvider,
  Loading,
  TGenericObject,
  useDocument,
} from '@development-framework/dm-core'
import React from 'react'

function App() {
  const idReference: string = `${import.meta.env.VITE_DATA_SOURCE}/$${
    import.meta.env.VITE_APPLICATION_ID
  }`
  const {
    document: application,
    isLoading,
    error,
  } = useDocument<TGenericObject>(idReference)

  if (isLoading) return <Loading />

  if (error) {
    console.error(error)
    return (
      <div style={{ color: 'red' }}>
        <b>Error:</b>Failed to load data, see web console for details
      </div>
    )
  }

  return (
    <FSTreeProvider visibleDataSources={application?.dataSources}>
      <EntityView idReference={idReference} type={application?.type} />
    </FSTreeProvider>
  )
}

export default App

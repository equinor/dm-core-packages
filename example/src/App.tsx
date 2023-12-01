import '@development-framework/dm-core/dist/main.css'
import {
  ApplicationContext,
  EntityView,
  FSTreeProvider,
  Loading,
  RoleProvider,
  TApplication,
  UiPluginProvider,
  useDocument,
} from '@development-framework/dm-core'
import React from 'react'
import './main.css'
import plugins from './plugins'

function App() {
  const idReference: string = `${import.meta.env.VITE_DATA_SOURCE}/$${
    import.meta.env.VITE_APPLICATION_ID
  }`
  const {
    document: application,
    isLoading,
    error,
  } = useDocument<TApplication>(idReference)

  if (isLoading) return <Loading />

  if (error || !application) {
    console.error(error)
    return (
      <div style={{ color: 'red' }}>
        <b>Error:</b>Failed to load data, see web console for details
      </div>
    )
  }

  return (
    <ApplicationContext.Provider value={application}>
      <UiPluginProvider pluginsToLoad={plugins}>
        <RoleProvider roles={application?.roles || []}>
          <FSTreeProvider visibleDataSources={application?.dataSources || []}>
            <EntityView idReference={idReference} type={application?.type} />
          </FSTreeProvider>
        </RoleProvider>
      </UiPluginProvider>
    </ApplicationContext.Provider>
  )
}

export default App

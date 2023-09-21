import {
  ApplicationContext,
  DMSSProvider,
  FSTreeProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import plugins from './plugins'
import ReactDOM from 'react-dom/client'

const APP_SETTINGS = {
  visibleDataSources: [
    'system',
    'DemoDataSource',
    'ExtraDataSource',
    'WorkflowDS',
  ],
  name: 'example',
}

const Content = () => {
  return (
    <DMSSProvider dmssBasePath={import.meta.env.VITE_DMSS_URL}>
      <ApplicationContext.Provider value={APP_SETTINGS}>
        <FSTreeProvider visibleDataSources={APP_SETTINGS.visibleDataSources}>
          <UiPluginProvider pluginsToLoad={plugins}>
            <App />
            <ToastContainer />
          </UiPluginProvider>
        </FSTreeProvider>
      </ApplicationContext.Provider>
    </DMSSProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
)

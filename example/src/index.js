import {
  ApplicationContext,
  DMSSProvider,
  FSTreeProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import plugins from './plugins'

const APP_SETTINGS = {
  visibleDataSources: [
    'system',
    'DemoDataSource',
    'ExtraDataSource',
    'WorkflowDS',
  ],
  name: 'example',
}
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <DMSSProvider>
      <ApplicationContext.Provider value={APP_SETTINGS}>
        <FSTreeProvider visibleDataSources={APP_SETTINGS.visibleDataSources}>
          <UiPluginProvider pluginsToLoad={plugins}>
            <App />
            <ToastContainer />
          </UiPluginProvider>
        </FSTreeProvider>
      </ApplicationContext.Provider>
    </DMSSProvider>
  </React.StrictMode>
)

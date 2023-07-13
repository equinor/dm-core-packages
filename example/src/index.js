import {
  ApplicationContext,
  DMSSProvider,
  FSTreeProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import ReactDOM from 'react-dom'
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

ReactDOM.render(
  <React.StrictMode>
    <DMSSProvider>
      <ApplicationContext.Provider value={APP_SETTINGS}>
        <FSTreeProvider visibleDataSources={APP_SETTINGS.visibleDataSources}>
          <UiPluginProvider pluginsToLoad={Object.values(plugins)}>
            <App />
          </UiPluginProvider>
        </FSTreeProvider>
      </ApplicationContext.Provider>
    </DMSSProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

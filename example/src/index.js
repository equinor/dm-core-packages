import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApplicationContext,
  FSTreeProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import { AuthProvider } from 'react-oauth2-code-pkce'
import plugins from './plugins'

const fullCurrentURL = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`

const authConfig = {
  clientId: '97a6b5bd-63fb-42c6-bb75-7e5de2394ba0',
  authorizationEndpoint:
    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/authorize',
  tokenEndpoint:
    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/token',
  scope: 'api://97a6b5bd-63fb-42c6-bb75-7e5de2394ba0/dmss',
  redirectUri: 'http://localhost/',
  decodeToken: true,
  logoutEndpoint:
    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/logout',
  preLogin: () => localStorage.setItem('preLoginPath', fullCurrentURL()),
  postLogin: () => {
    if (localStorage.getItem('preLoginPath') !== fullCurrentURL()) {
      window.location.href = localStorage.getItem('preLoginPath')
    }
  },
}
const APP_SETTINGS = {
  visibleDataSources: ['system', 'DemoDataSource', 'WorkflowDS'],
  name: 'example',
}

ReactDOM.render(
  <React.StrictMode>
    {/*<AuthProvider authConfig={authConfig}>*/}
    <ApplicationContext.Provider value={APP_SETTINGS}>
      <FSTreeProvider visibleDataSources={APP_SETTINGS.visibleDataSources}>
        <UiPluginProvider pluginsToLoad={plugins}>
          <App />
        </UiPluginProvider>
      </FSTreeProvider>
    </ApplicationContext.Provider>
    {/*</AuthProvider>*/}
  </React.StrictMode>,
  document.getElementById('root')
)

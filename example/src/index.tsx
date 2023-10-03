import {
  ApplicationContext,
  DMSSProvider,
  RoleProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import plugins from './plugins'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oauth2-code-pkce'
import App from './App'

const fullCurrentURL = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`

const authEnabled = import.meta.env.VITE_AUTH_ENABLED === '1'
const authConfig = {
  clientId: import.meta.env.VITE_CLIENT_ID,
  authorizationEndpoint: `https://login.microsoftonline.com/${
    import.meta.env.VITE_TENANT_ID
  }/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${
    import.meta.env.VITE_TENANT_ID
  }/oauth2/v2.0/token`,
  scope: import.meta.env.VITE_AUTH_SCOPE,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  logoutEndpoint: `https://login.microsoftonline.com/${
    import.meta.env.VITE_TENANT_ID
  }/oauth2/logout`,
  preLogin: () => localStorage.setItem('preLoginPath', fullCurrentURL()),
  postLogin: () => {
    if (localStorage.getItem('preLoginPath') !== fullCurrentURL()) {
      // @ts-ignore
      window.location.href = localStorage.getItem('preLoginPath')
    }
  },
}

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
        <UiPluginProvider pluginsToLoad={plugins}>
          <RoleProvider>
            <App />
          </RoleProvider>
          <ToastContainer />
        </UiPluginProvider>
      </ApplicationContext.Provider>
    </DMSSProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    {authEnabled ? (
      <AuthProvider authConfig={authConfig}>
        <Content />
      </AuthProvider>
    ) : (
      <Content />
    )}
  </React.StrictMode>
)

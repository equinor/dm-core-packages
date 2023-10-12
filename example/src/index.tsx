import {
  ApplicationContext,
  DMJobProvider,
  DMSSProvider,
  RoleProvider,
  UiPluginProvider,
} from '@development-framework/dm-core'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import plugins from './plugins'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from 'react-oauth2-code-pkce'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import App from './App'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => toast.error(`An error occured. Message: ${error}`),
  }),
})
const Content = () => {
  const overrideRoles = import.meta.env.VITE_TEST_ROLES
    ? JSON.parse(import.meta.env.VITE_TEST_ROLES)
    : []

  return (
    <QueryClientProvider client={queryClient}>
      <DMSSProvider dmssBasePath={import.meta.env.VITE_DMSS_URL}>
        <DMJobProvider dmJobPath={import.meta.env.VITE_DM_JOB_URL}>
          <ApplicationContext.Provider value={APP_SETTINGS}>
            <UiPluginProvider pluginsToLoad={plugins}>
              <RoleProvider overrideRoles={overrideRoles}>
                <App />
              </RoleProvider>
              <ToastContainer />
            </UiPluginProvider>
          </ApplicationContext.Provider>
        </DMJobProvider>
      </DMSSProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
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

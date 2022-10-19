import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApplicationContext,
  FSTreeProvider,
} from '@development-framework/dm-core'

const fullCurrentURL = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`

const authConfig = {
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || 'allo',
  authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '',
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || '',
  scope: process.env.REACT_APP_AUTH_SCOPE || '',
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || '',
  logoutEndpoint: process.env.REACT_APP_LOGOUT_ENDPOINT || '',
  preLogin: () => localStorage.setItem('preLoginPath', fullCurrentURL()),
  postLogin: () => {
    if (localStorage.getItem('preLoginPath') !== fullCurrentURL()) {
      window.location.href = localStorage.getItem('preLoginPath')
    }
  },
}
const APP_SETTINGS = {
  visibleDataSources: ['system', 'DemoDS'],
  name: 'Example DM App',
}

ReactDOM.render(
  <>
    {/*<AuthProvider authConfig={authConfig}>*/}
    <ApplicationContext.Provider value={APP_SETTINGS}>
      <FSTreeProvider visibleDataSources={APP_SETTINGS.visibleDataSources}>
        <App />
      </FSTreeProvider>
    </ApplicationContext.Provider>
    {/*</AuthProvider>*/}
  </>,
  document.getElementById('root')
)

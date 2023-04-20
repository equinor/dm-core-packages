import { AuthContext } from 'react-oauth2-code-pkce'
import React, { createContext, ReactNode, useContext } from 'react'
import DmssAPI from '../services/api/DmssAPI'

const DMSSContext = createContext<DmssAPI | undefined>(undefined)

export const DMSSProvider = (props: {
  children: ReactNode
  dmssBasePath?: string
}) => {
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token, props.dmssBasePath)
  return (
    <DMSSContext.Provider value={dmssAPI}>
      {props.children}
    </DMSSContext.Provider>
  )
}

export const useDMSS = () => {
  const context = useContext(DMSSContext)
  if (context === undefined) {
    throw new Error('useDMSS must be used within a DMSSProvider')
  }
  return context
}

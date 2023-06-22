import { TViewConfig } from '@development-framework/dm-core'
import React, { createContext, useContext } from 'react'

type Props = {
  idReference: string
  onOpen?: (key: string, view: TViewConfig, rootId?: string) => void
}

const RegistryContext = createContext<Props | undefined>(undefined)

export const useRegistryContext = () => {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistryContext must be used within a RegistryProvider')
  }
  return context
}

export const RegistryProvider = (props: Props & { children: JSX.Element }) => {
  const { children, ...value } = props

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  )
}

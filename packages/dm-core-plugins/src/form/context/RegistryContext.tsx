import type { TOnOpen } from '@development-framework/dm-core'
import { createContext, useContext } from 'react'
import type { TFormConfig } from '../types'

type Props = {
  idReference: string
  onOpen?: TOnOpen
  config: TFormConfig
}

const RegistryContext = createContext<Props | undefined>(undefined)

export const useRegistryContext = () => {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistryContext must be used within a RegistryProvider')
  }
  return context
}

export const RegistryProvider = (
  props: Props & { children: React.ReactElement }
) => {
  const { children, ...value } = props

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  )
}

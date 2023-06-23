import React, { createContext, useContext } from 'react'
import widgets from './widgets/'

export const RegistryContext = createContext<any>({
  fields: {},
  widgets: {},
})

export const useRegistryContext = () => {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistryContext must be used within a RegistryProvider')
  }
  return context
}

export const RegistryProvider = (props: any) => {
  const { children, idReference, onOpen } = props

  const getWidget = (namePath: string, widgetName: string) => {
    const name = widgetName.trim()
    if (name in widgets) return widgets[name]
    return () => <div>Did not find widget: {name} </div>
  }

  const value = {
    getWidget,
    idReference,
    onOpen,
  }

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  )
}

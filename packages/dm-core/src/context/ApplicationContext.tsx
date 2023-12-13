import React, { useContext } from 'react'
export const ApplicationContext = React.createContext<any>({})

export const useApplication = () => {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within a ApplicationProvider')
  }
  return context
}

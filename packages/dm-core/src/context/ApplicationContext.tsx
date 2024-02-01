import React, { useContext, useState } from 'react'
import { TValidEntity } from '../types'

type TApplicationProvider = {
  application: any
  selectedEntity: TValidEntity | undefined
  setSelectedEntity: React.Dispatch<
    React.SetStateAction<TValidEntity | undefined>
  >
}

export const ApplicationContext = React.createContext<TApplicationProvider>({
  application: undefined,
  selectedEntity: undefined,
  setSelectedEntity: () => null,
})

export const useApplication = () => {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within a ApplicationProvider')
  }
  return context
}

export const ApplicationProvider = (props: {
  application: any
  children?: any
}) => {
  const [selectedEntity, setSelectedEntity] = useState<
    TValidEntity | undefined
  >(undefined)

  function setIt(e: any) {
    console.log('I CALLED SETSELECTEDENTITY')
    setSelectedEntity(e)
  }
  const value: TApplicationProvider = {
    application: props.application,
    selectedEntity,
    setSelectedEntity: setIt,
  }

  return (
    <ApplicationContext.Provider value={value}>
      {value.application ? props.children : <div>Fetching application</div>}
    </ApplicationContext.Provider>
  )
}

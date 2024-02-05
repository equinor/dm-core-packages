import React, { useContext, useReducer } from 'react'
import { TValidEntity } from '../types'
import { set } from 'lodash'

type TApplicationProvider = {
  application: any
  updateEntity: (idReference: string, entity: any) => void
  selectedEntity: TValidEntity | undefined
  setSelectedEntity: (entity: any) => void
}

export const ApplicationContext = React.createContext<TApplicationProvider>({
  application: undefined,
  updateEntity: () => null,
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

enum EntityActionType {
  UPDATEENTITY = 'UPDATEENTITY',
  SETSELECTEDENTITY = 'SETSELECTEDENTITY',
}

type TEntityParams = {
  type: EntityActionType
  idReference: string
  entity: any
}

function entityReducer(state: any, payload: TEntityParams) {
  const { type, idReference, entity } = payload
  switch (type) {
    case EntityActionType.SETSELECTEDENTITY:
      return entity
    case EntityActionType.UPDATEENTITY: {
      const paths = idReference.split('.')
      const scope = paths.slice(1).join('.')
      return {
        ...set(state, scope, entity),
      }
    }
    default:
      return state
  }
}

export const ApplicationProvider = (props: {
  application: any
  children?: any
}) => {
  const [selectedEntity, selectedEntityDispatch] = useReducer(
    entityReducer,
    undefined
  )

  function setSelectedEntity(entity: any) {
    selectedEntityDispatch({
      type: EntityActionType.SETSELECTEDENTITY,
      idReference: '',
      entity,
    })
  }

  function updateEntity(idReference: string, entity: any) {
    selectedEntityDispatch({
      type: EntityActionType.UPDATEENTITY,
      idReference,
      entity,
    })
  }

  const value: TApplicationProvider = {
    application: props.application,
    updateEntity,
    selectedEntity,
    setSelectedEntity,
  }

  return (
    <ApplicationContext.Provider value={value}>
      {value.application ? props.children : <div>Fetching application</div>}
    </ApplicationContext.Provider>
  )
}

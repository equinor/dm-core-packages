import { ReactNode, createContext, useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import DmssAPI from '../services/api/DmssAPI'

const DMSSContext = createContext<DmssAPI | undefined>(undefined)

export const DMSSProvider = (props: {
  children: ReactNode
  dmssBasePath?: string
  enableBlueprintCache?: boolean
}) => {
  const { token } = useContext(AuthContext)
  const dmssAPIOriginal = new DmssAPI(token, props.dmssBasePath)
  const dmssAPI = new DmssAPI(token, props.dmssBasePath)

  // @ts-ignore
  dmssAPI.blueprintGet = async (requestParameters, options) => {
    const cacheKey = `${requestParameters.typeRef}${requestParameters.context}`
    const cachedValue = window.sessionStorage.getItem(cacheKey)
    if (!cachedValue) {
      return dmssAPIOriginal
        .blueprintGet(requestParameters)
        .then((response) => {
          if (props.enableBlueprintCache)
            window.sessionStorage.setItem(
              cacheKey,
              JSON.stringify(response.data)
            )
          return response
        })
    }
    return {
      data: JSON.parse(cachedValue),
      status: 200,
      statusText: 'ok',
    }
  }

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

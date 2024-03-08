import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { ToastContainer } from 'react-toastify'
import { Tree, TreeNode } from './domain/Tree'
import { DmJobAPI } from './services'
import DmssAPI from './services/api/DmssAPI'
import { IUIPlugin, TApplication, TRole, TUiPluginMap } from './types'
import { ErrorGroup } from './utils/ErrorBoundary'

const DEFAULT_ROLE: TRole = {
  name: 'anonymous',
  authServerRoleName: 'anonymous',
  label: 'Anonymous',
}
export const ApplicationContext = React.createContext<
  | {
      name: string
      dmssAPI: DmssAPI
      dmJobApi: DmJobAPI
      getUiPlugin: (
        pluginName: string
      ) => (props: IUIPlugin) => React.ReactElement
      visibleDataSources: string[]
      role: TRole
      setRole: Dispatch<SetStateAction<TRole>>
      roles: TRole[]
      tree: null | Tree
      treeNodes: TreeNode[]
      loading: boolean
    }
  | undefined
>(undefined)

function capitalizeFirstLetter(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function findFirstCommonRole(appRoles: TRole[], actualRoles: string[]): TRole {
  const matchingRole = appRoles.find((r: TRole) =>
    actualRoles.includes(r.authServerRoleName)
  )
  return matchingRole ?? appRoles[0]
}

function generateFallbackRoles(roles: string[] | undefined): TRole[] {
  if (!roles) {
    console.warn('No roles has been configured for the application')
    return [DEFAULT_ROLE]
  }
  return roles.map((r) => ({
    name: r,
    label: capitalizeFirstLetter(r),
    authServerRoleName: r,
  }))
}

export const DMApplicationProvider = (props: {
  children: ReactNode
  application: TApplication
  dmJobPath: string
  dmssBasePath?: string
  enableBlueprintCache: boolean
  plugins: TUiPluginMap
}) => {
  const [role, setRole] = useState<TRole>(DEFAULT_ROLE)
  const [roles, setRoles] = useState<TRole[]>(props.application.roles || [])
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const { token, tokenData } = useContext(AuthContext)
  const dmJobApi = new DmJobAPI(token, props.dmJobPath)

  const dmssAPIOriginal = new DmssAPI(token, props.dmssBasePath)
  const dmssAPI = new DmssAPI(token, props.dmssBasePath)
  const tree: Tree = new Tree(dmssAPI, (t: Tree) => setTreeNodes([...t]))

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

  function getUiPlugin(
    pluginName: string
  ): (props: IUIPlugin) => React.ReactElement {
    const plugin = props.plugins[pluginName]?.component
    if (!plugin)
      return () => (
        <ErrorGroup>Did not find the plugin: {pluginName}</ErrorGroup>
      )
    return plugin
  }

  useEffect(() => {
    let newRoles = props.application.roles || []
    if (tokenData) {
      newRoles = newRoles.filter((role) =>
        tokenData.roles.includes(role.authServerRoleName)
      )
    }
    if (props.application.roles && !props.application.roles.length) {
      // No roles is configured in application. Generate from roles in token
      newRoles = generateFallbackRoles(tokenData?.roles)
    }
    setRoles(newRoles)
    setRole(findFirstCommonRole(newRoles, tokenData?.roles ?? [])) // Default select the first role that exists in tokenData
  }, [tokenData])

  useEffect(() => {
    setLoading(true)
    tree
      .initFromDataSources(props.application.dataSources)
      .finally(() => setLoading(false))
  }, [])

  return (
    <ApplicationContext.Provider
      value={{
        dmJobApi,
        dmssAPI,
        getUiPlugin,
        visibleDataSources: props.application.dataSources || [],
        name: props.application.name,
        role,
        setRole,
        roles,
        tree,
        treeNodes,
        loading,
      }}
    >
      {props.children}
      <ToastContainer />
    </ApplicationContext.Provider>
  )
}
export const useApplication = () => {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplication must be used within a ApplicationProvider')
  }
  return context
}

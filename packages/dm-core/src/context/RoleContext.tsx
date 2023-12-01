import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { TRole } from '../types'

const DEFAULT_ROLE: TRole = {
  name: 'anonymous',
  authServerRoleName: 'anonymous',
  label: 'Anonymous',
}
export const RoleContext = createContext<{
  role: TRole
  setRole: Dispatch<SetStateAction<TRole>>
  roles: TRole[]
}>({
  role: DEFAULT_ROLE,
  // @ts-ignore
  setRole: () => {
    throw new Error('RoleContex was accessed before the provider registered.')
  },
  roles: [],
})

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

export const RoleProvider = (props: {
  children: ReactNode
  roles: TRole[]
}) => {
  const { children, roles: passedRoles } = props
  const [role, setRole] = useState<TRole>(DEFAULT_ROLE)
  const [roles, setRoles] = useState<TRole[]>(passedRoles)
  const { tokenData } = useContext(AuthContext)

  useEffect(() => {
    let newRoles = passedRoles
    if (passedRoles && !passedRoles.length) {
      // No roles is configured in application. Generate from roles in token
      newRoles = generateFallbackRoles(tokenData?.roles)
    }
    setRoles(newRoles)
    setRole(findFirstCommonRole(newRoles, tokenData?.roles ?? [])) // Default select the first role that exists in tokenData
  }, [tokenData])

  return (
    <RoleContext.Provider value={{ role, setRole, roles }}>
      {children}
    </RoleContext.Provider>
  )
}

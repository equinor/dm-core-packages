import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'

export const RoleContext = createContext<{
	selectedRole: string
	setSelectedRole: any
	roles: string[]
}>({
	selectedRole: 'anonymous',
	setSelectedRole: null,
	roles: [],
})

export const RoleProvider = (props: {
	overrideRoles: string[]
	children: ReactNode
}) => {
	const { children, overrideRoles } = props
	const [selectedRole, setSelectedRole] = useState<string>('anonymous')
	const [roles, setRoles] = useState<string[]>([])
	const { tokenData } = useContext(AuthContext)

	useEffect(() => {
		const roles = overrideRoles.length ? overrideRoles : tokenData?.roles
		setRoles(roles)
		if (roles) setSelectedRole(roles[0])
	}, [tokenData])

	return (
		<RoleContext.Provider value={{ selectedRole, setSelectedRole, roles }}>
			{children}
		</RoleContext.Provider>
	)
}

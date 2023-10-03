import React, { createContext, ReactNode, useState } from 'react'

export const RoleContext = createContext<{
  selectedRole: string
  setSelectedRole: any
}>({
  selectedRole: 'anonymous',
  setSelectedRole: null,
})

export const RoleProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const [selectedRole, setSelectedRole] = useState<string>('anonymous')
  return (
    <RoleContext.Provider value={{ selectedRole, setSelectedRole }}>
      {children}
    </RoleContext.Provider>
  )
}

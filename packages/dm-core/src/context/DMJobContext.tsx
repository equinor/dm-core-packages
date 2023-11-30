import React, { createContext, ReactNode, useContext } from 'react'
import { DmJobAPI } from '../services'
import { AuthContext } from 'react-oauth2-code-pkce'

const DMJobContext = createContext<DmJobAPI | undefined>(undefined)

export const DMJobProvider = (props: {
	children: ReactNode
	dmJobPath?: string
}) => {
	const { token } = useContext(AuthContext)
	if (!props.dmJobPath) throw new Error('DMJobProvider is missing a job api url')
	const dmJobApi = new DmJobAPI(token, props.dmJobPath)
	return (
		<DMJobContext.Provider value={dmJobApi}>
			{props.children}
		</DMJobContext.Provider>
	)
}

export const useDmJob = () => {
	const context = useContext(DMJobContext)
	if (!context) throw new Error('useDmJob must be used within a DMJobProvider')
	return context
}

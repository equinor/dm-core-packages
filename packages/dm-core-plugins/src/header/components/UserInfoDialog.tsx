import { Dialog, RoleContext, useDMSS } from '@development-framework/dm-core'
import { Button, Radio, Typography } from '@equinor/eds-core-react'
import { AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { TApplication } from '../types'

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: inline-flex;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const UserInfoLabel = styled.b`
  margin-left: 5px;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`

type UserInfoDialogProps = {
	isOpen: boolean
	setIsOpen: (newValue: boolean) => void
	applicationEntity: TApplication
}

export const UserInfoDialog = (props: UserInfoDialogProps) => {
	const { isOpen, setIsOpen } = props
	const [apiKey, setAPIKey] = useState<string | null>(null)
	const { tokenData, token, logOut } = useContext(AuthContext)
	const dmssAPI = useDMSS()
	const { selectedRole, setSelectedRole, roles } = useContext(RoleContext)
	const [tempSelectedRole, setTempSelectedRole] = useState<string>(selectedRole)

	return (
		<Dialog
			isDismissable
			open={isOpen}
			onClose={() => setIsOpen(false)}
			width={'720px'}
		>
			<Dialog.Header>
				<Dialog.Title>User info</Dialog.Title>
			</Dialog.Header>
			<Dialog.CustomContent>
				<Row>
					Name:<UserInfoLabel>{tokenData?.name}</UserInfoLabel>
				</Row>
				<Row>
					Username:
					<UserInfoLabel>{tokenData?.preferred_username}</UserInfoLabel>
				</Row>
				<Row>
					Roles:
					<UserInfoLabel>{JSON.stringify(roles)}</UserInfoLabel>
				</Row>
				{apiKey && <pre>{apiKey}</pre>}

				{roles?.length && (
					<>
						<Typography>Chose role (UI only) {tempSelectedRole}</Typography>
						<UnstyledList>
							{roles.map((role: string) => (
								<li key={role}>
									<Radio
										label={role}
										name='impersonate-role'
										value={role}
										checked={tempSelectedRole != 'anonymous' && role == tempSelectedRole}
										onChange={(e: any) => setTempSelectedRole(e.target.value)}
									/>
								</li>
							))}
						</UnstyledList>
					</>
				)}
			</Dialog.CustomContent>
			<Dialog.Actions>
				<FlexRow style={{ justifyContent: 'space-between', width: '100%' }}>
					<FlexRow>
						<Button
							variant='ghost'
							onClick={() => {
								navigator.clipboard.writeText(token)
								toast.success('Copied token to clipboard')
							}}
						>
							Copy token to clipboard
						</Button>
						<Button
							variant='ghost'
							onClick={() =>
								dmssAPI
									.tokenCreate()
									.then((response: AxiosResponse<string>) => setAPIKey(response.data))
									.catch((error: any) => {
										console.error(error)
										toast.error('Failed to create personal access token')
									})
							}
						>
							Create API-Key
						</Button>
					</FlexRow>
					<FlexRow>
						<Button variant='ghost' color='danger' onClick={() => logOut()}>
							Log out
						</Button>
						<Button
							onClick={() => {
								setSelectedRole(tempSelectedRole)
								setIsOpen(false)
							}}
						>
							{selectedRole !== tempSelectedRole ? 'Save' : 'Cancel'}
						</Button>
					</FlexRow>
				</FlexRow>
			</Dialog.Actions>
		</Dialog>
	)
}

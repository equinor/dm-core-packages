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
            <Typography>Chose role (UI only)</Typography>
            <UnstyledList>
              {roles.map((role: string) => (
                <li key={role}>
                  <Radio
                    label={role}
                    name="impersonate-role"
                    value={role}
                    checked={
                      selectedRole != 'anonymous' && role == selectedRole
                    }
                    onChange={(e: any) => setSelectedRole(e.target.value)}
                  />
                </li>
              ))}
            </UnstyledList>
          </>
        )}
      </Dialog.CustomContent>
      <Dialog.Actions>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(token)
            toast.success('Copied token to clipboard')
          }}
        >
          Copy token to clipboard
        </Button>
        <Button
          onClick={() =>
            dmssAPI
              .tokenCreate()
              .then((response: AxiosResponse<string>) =>
                setAPIKey(response.data)
              )
              .catch((error: any) => {
                console.error(error)
                toast.error('Failed to create personal access token')
              })
          }
        >
          Create API-Key
        </Button>
        <Button onClick={() => logOut()}>Log out</Button>
        <Button variant="outlined" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

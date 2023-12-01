import {
  Dialog,
  RoleContext,
  TApplication,
  TRole,
  useDMSS,
} from '@development-framework/dm-core'
import { Button, Radio, Typography } from '@equinor/eds-core-react'
import { AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { toast } from 'react-toastify'
import styled from 'styled-components'

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: inline-flex;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px;

  > * {
    margin-left: 10px;
  }
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
  const { role, setRole, roles } = useContext(RoleContext)
  const [selectedRole, setSelectedRole] = useState<TRole>(role)

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
          Name:
          <UserInfoLabel>
            {tokenData?.name || 'Not authenticated'}
          </UserInfoLabel>
        </Row>
        <Row>
          Username:
          <UserInfoLabel>
            {tokenData?.preferred_username || 'Not authenticated'}
          </UserInfoLabel>
        </Row>
        {apiKey && (
          <Row>
            API Key:
            <pre>{apiKey}</pre>
          </Row>
        )}

        {roles.length > 1 && (
          <>
            <Typography variant='h6'>Chose role (UI only)</Typography>
            <UnstyledList>
              {roles.map((role: TRole) => (
                <li key={role.name}>
                  <Radio
                    label={role.label}
                    name='impersonate-role'
                    value={role.name}
                    checked={role.name === selectedRole.name}
                    onChange={() => setSelectedRole(role)}
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
          </FlexRow>
          <FlexRow>
            <Button variant='ghost' color='danger' onClick={() => logOut()}>
              Log out
            </Button>
            <Button
              onClick={() => {
                setRole(selectedRole)
                setIsOpen(false)
              }}
              disabled={role === selectedRole}
            >
              Save
            </Button>
          </FlexRow>
        </FlexRow>
      </Dialog.Actions>
    </Dialog>
  )
}

import { Dialog, useDMSS } from '@development-framework/dm-core'
import {Button, Radio, Typography} from '@equinor/eds-core-react'
import { AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { TApplication } from '../types'
import { useLocalStorage } from '../useLocalStorage'

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
  const { isOpen, setIsOpen, applicationEntity } = props
  const [apiKey, setAPIKey] = useState<string | null>(null)
  const { tokenData, token, logOut } = useContext(AuthContext)
  const dmssAPI = useDMSS()
  const [checked, updateChecked] = useLocalStorage<string | null>(
    'impersonateRoles',
    null
  )

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
          <UserInfoLabel>{JSON.stringify(tokenData?.roles)}</UserInfoLabel>
        </Row>
        {apiKey && <pre>{apiKey}</pre>}

        {tokenData?.roles.includes(applicationEntity.adminRole) && (
          <>
            <Typography>Impersonate a role (UI only)</Typography>
            <UnstyledList>
              {applicationEntity.roles &&
                applicationEntity.roles.map((role: string) => (
                  <li key={role}>
                    <Radio
                      label={role}
                      name="impersonate-role"
                      value={role}
                      checked={checked === role}
                      onChange={(e: any) => updateChecked(e.target.value)}
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

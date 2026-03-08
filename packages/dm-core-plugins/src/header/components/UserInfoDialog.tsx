import {
  Dialog,
  type TApplication,
  type TRole,
  useApplication,
} from '@development-framework/dm-core'
import { Button, Icon, Radio, Typography } from '@equinor/eds-core-react'
import { account_circle, close } from '@equinor/eds-icons'
import type { AxiosResponse } from 'axios'
import { useContext, useId, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { toast } from 'react-toastify'
import { Stack } from '../../common'

type UserInfoDialogProps = {
  applicationEntity: TApplication
}

export const UserInfoDialog = (props: UserInfoDialogProps) => {
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false)
  const [apiKey, setAPIKey] = useState<string | null>(null)
  const { tokenData, token, logOut } = useContext(AuthContext)
  const { dmssAPI, role, setRole, roles } = useApplication()
  const [selectedRole, setSelectedRole] = useState<TRole>(role)
  const uiRoleRadioGroupId = useId()

  return (
    <>
      <Button
        aria-haspopup='dialog'
        aria-label='Open user information dialog'
        variant='ghost_icon'
        onClick={() => setIsUserInfoDialogOpen(true)}
      >
        <Icon data={account_circle} size={24} title='User' />
      </Button>
      <Dialog
        isDismissable
        open={isUserInfoDialogOpen}
        onClose={() => {
          setSelectedRole(role)
          setIsUserInfoDialogOpen(false)
        }}
      >
        <Dialog.Header>
          <Dialog.Title>User info</Dialog.Title>
          <Button
            aria-label='Close user information dialog'
            variant='ghost_icon'
            onClick={() => {
              setSelectedRole(role)
              setIsUserInfoDialogOpen(false)
            }}
          >
            <Icon data={close} size={16} />
          </Button>
        </Dialog.Header>
        <Dialog.Content>
          <Stack spacing={1}>
            <Stack spacing={0.25}>
              <Typography variant='body_short'>
                Name: <b>{tokenData?.name || 'Not authenticated'}</b>
              </Typography>
              <Typography variant='body_short'>
                Username:{' '}
                <b>{tokenData?.preferred_username || 'Not authenticated'}</b>
              </Typography>
              {apiKey && (
                <Typography variant='body_short'>
                  API Key:{' '}
                  <pre
                    style={{ display: 'inline-block', padding: 0, margin: 0 }}
                  >
                    {apiKey}
                  </pre>
                </Typography>
              )}
            </Stack>
            {roles.length > 1 && (
              <div>
                <Typography variant='h6' id={`${uiRoleRadioGroupId}_label`}>
                  Chose role (UI only)
                </Typography>
                <Stack
                  role='radiogroup'
                  aria-labelledby={`${uiRoleRadioGroupId}_label`}
                  direction='row'
                  spacing={0.75}
                >
                  {roles.map((role: TRole) => (
                    <Radio
                      key={role.name}
                      label={role.label}
                      name='impersonate-role'
                      value={role.name}
                      checked={role.name === selectedRole.name}
                      onChange={() => setSelectedRole(role)}
                    />
                  ))}
                </Stack>
              </div>
            )}
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
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
          <Button variant='ghost' color='danger' onClick={() => logOut()}>
            Log out
          </Button>
          <Button
            onClick={() => {
              setRole(selectedRole)
              setIsUserInfoDialogOpen(false)
            }}
            disabled={role === selectedRole}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

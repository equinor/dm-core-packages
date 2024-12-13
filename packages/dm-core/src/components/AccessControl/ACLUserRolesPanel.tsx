import {
  Button,
  EdsProvider,
  Icon,
  Table,
  TextField,
} from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { useState } from 'react'
import { Stack } from '../../layout'
import { type AccessControlList, AccessLevel } from '../../services'
import { ACLSelect } from './ACLSelect'

interface IURPanelProps {
  roles: { [key: string]: AccessLevel }
  handleChange: (data: Partial<AccessControlList>) => void
  aclKey: string
}

export const ACLUserRolesPanel = ({
  roles,
  handleChange,
  aclKey,
}: IURPanelProps): React.ReactElement => {
  const [newRole, setNewRole] = useState<string>('')

  const userTab = aclKey === 'users'

  return (
    <Stack spacing={1}>
      <Stack direction='row' spacing={0.5} alignItems='flex-end'>
        <TextField
          id='new-role-user'
          style={{ width: '250px' }}
          placeholder={userTab ? 'Shortname of user' : 'Role'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewRole(e.target.value)
          }
          label={`Name of existing ${userTab ? 'user' : 'role'} to add`}
        />
        <Button
          onClick={() =>
            handleChange({
              [aclKey]: { ...roles, [newRole]: AccessLevel.None },
            })
          }
          disabled={!newRole}
        >
          Add +
        </Button>
      </Stack>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>
              {aclKey[0].toUpperCase() + aclKey.substring(1)}
            </Table.Cell>
            <Table.Cell>Access Level</Table.Cell>
            <Table.Cell aria-label='Remove role' />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(roles).map(([role, access], index) => (
            <Table.Row key={role}>
              <Table.Cell>{role}</Table.Cell>
              <Table.Cell>
                <ACLSelect
                  value={access}
                  handleChange={(value: AccessLevel) => {
                    roles[role] = value
                    handleChange({ [aclKey]: roles })
                  }}
                />
              </Table.Cell>
              <Table.Cell style={{ textAlign: 'right' }}>
                <EdsProvider density={'compact'}>
                  <Button
                    color='secondary'
                    variant='ghost_icon'
                    onClick={() => {
                      delete roles[role]
                      handleChange({ [aclKey]: roles })
                    }}
                    aria-label='Remove role from acl'
                  >
                    <Icon size={16} data={close} />
                  </Button>
                </EdsProvider>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  )
}

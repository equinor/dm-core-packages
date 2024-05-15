import { Button, EdsProvider, Icon, TextField } from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import React, { useState } from 'react'
import styled from 'styled-components'
import { AccessControlList, AccessLevel } from '../../services'
import { ACLSelect } from './ACLSelect'

interface IURPanelProps {
  roles: { [key: string]: AccessLevel }
  handleChange: (data: Partial<AccessControlList>) => void
  aclKey: string
}

const TableWrapper = styled.div`
  border: black 1px solid;
  border-radius: 3px;
  max-height: 40vh;
  overflow: auto;
  margin-bottom: 10px;
`

const GridContainer = styled.div<{ even: boolean }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
  background-color: ${(props) => (props.even ? '#f2f2f6' : '#d3d5de')};
`

export const ACLUserRolesPanel = ({
  roles,
  handleChange,
  aclKey,
}: IURPanelProps): React.ReactElement => {
  const [newRole, setNewRole] = useState<string>('')

  const userTab = aclKey === 'users'

  return (
    <>
      <div className='flex justify-between my-2'>
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
      </div>
      <div className='flex justify-around'>
        <div>{aclKey[0].toUpperCase() + aclKey.substring(1)}</div>
        <div>Access Level</div>
        <div></div>
      </div>
      <TableWrapper>
        {Object.entries(roles).map(([role, access], index) => (
          <GridContainer key={role} even={index % 2 === 0}>
            {role}
            <div style={{ gridColumn: '2 / span 3' }}>
              <ACLSelect
                value={access}
                handleChange={(value: AccessLevel) => {
                  roles[role] = value
                  handleChange({ [aclKey]: roles })
                }}
              />
            </div>
            <EdsProvider density={'compact'}>
              <Button
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
          </GridContainer>
        ))}
      </TableWrapper>
    </>
  )
}

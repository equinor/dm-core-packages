import { Button, Input, Typography } from '@equinor/eds-core-react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { AccessControlList, AccessLevel } from '../../services'
import { ACLSelect } from './ACLSelect'
import { CenteredRow } from './AccessControlListComponent'

interface IURPanelProps {
  entities: { [key: string]: AccessLevel }
  handleChange: (data: Partial<AccessControlList>) => void
  aclKey: string
}

type TGridContainerType = {
  even?: boolean
}

const ListRow = styled.div<TGridContainerType>`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 5px;
  justify-content: space-around;
  background-color: ${(props) => (props.even ? '#F7F7F7' : 'inherit')};
`

const TableWrapper = styled.div`
  border: black 1px solid;
  border-radius: 3px;
  max-height: 200px;
  overflow: auto;
  margin-bottom: 10px;
`

const GridContainer = styled.div<TGridContainerType>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  background-color: ${(props) => (props.even ? '#F7F7F7' : 'inherit')};
`

export const ACLUserRolesPanel = ({
  entities,
  handleChange,
  aclKey,
}: IURPanelProps): JSX.Element => {
  const [newRole, setNewRole] = useState<string>('')
  const getPlaceholderText = () => {
    if (aclKey === 'users') {
      return 'Add new user'
    } else if (aclKey === 'roles') {
      return 'Add new role'
    } else {
      new Error(`aclKey ${aclKey} is invalid`)
    }
  }
  return (
    <>
      {aclKey === 'users' && (
        <Typography variant="body_short_italic">Use short name</Typography>
      )}
      <CenteredRow>
        <Input
          style={{ width: '170px' }}
          placeholder={getPlaceholderText()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewRole(e.target.value)
          }
        />
        <Button
          onClick={() =>
            handleChange({
              [aclKey]: { ...entities, [newRole]: AccessLevel.NONE },
            })
          }
          disabled={!newRole}
        >
          Add +
        </Button>
      </CenteredRow>
      <ListRow>
        <div>{aclKey[0].toUpperCase() + aclKey.substring(1)}</div>
        <div>Access Level</div>
        <div></div>
      </ListRow>
      <TableWrapper>
        {Object.entries(entities).map(([entity, access], index) => {
          const roleHandleChange = (value: AccessLevel) => {
            entities[entity] = value
            handleChange({ [aclKey]: entities })
          }
          return (
            <GridContainer key={entity} even={index % 2 == 0}>
              <div>{entity}</div>
              <ACLSelect value={access} handleChange={roleHandleChange} />
              <Button
                variant="outlined"
                color="danger"
                onClick={() => {
                  delete entities[entity]
                  handleChange({ [aclKey]: entities })
                }}
              >
                Remove
              </Button>
            </GridContainer>
          )
        })}
      </TableWrapper>
    </>
  )
}

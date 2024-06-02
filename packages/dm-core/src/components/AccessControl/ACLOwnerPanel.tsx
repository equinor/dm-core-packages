import { Input, Typography } from '@equinor/eds-core-react'
import React from 'react'
import { Stack } from '../../layout'
import { AccessControlList, AccessLevel } from '../../services'
import { ACLSelect } from './ACLSelect'

interface IACLOwnerPanelProps {
  acl: AccessControlList
  handleChange: (data: Partial<AccessControlList>) => void
}

export const ACLOwnerPanel = ({
  acl,
  handleChange,
}: IACLOwnerPanelProps): React.ReactElement => {
  return (
    <Stack spacing={0.5} direction='row'>
      <Stack spacing={0.125}>
        <Typography variant='label' group='input'>
          Owner:
        </Typography>
        <Input
          style={{ width: '150px' }}
          placeholder={acl.owner}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChange({ owner: event.target.value })
          }
        />
      </Stack>
      <Stack spacing={0.125}>
        <Typography variant='label' group='input'>
          Others:
        </Typography>
        <ACLSelect
          value={acl.others || AccessLevel.None}
          handleChange={(newValue: AccessLevel) =>
            handleChange({ others: newValue })
          }
        />
      </Stack>
    </Stack>
  )
}

import { Input } from '@equinor/eds-core-react'
import React from 'react'
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
    <div className='flex justify-between'>
      <div className='flex content-center items-center'>
        Owner:
        <Input
          style={{ width: '150px', marginLeft: '5px' }}
          placeholder={acl.owner}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChange({ owner: event.target.value })
          }
        />
      </div>
      <div className='flex items-center'>
        Others:
        <ACLSelect
          value={acl.others || AccessLevel.None}
          handleChange={(newValue: AccessLevel) =>
            handleChange({ others: newValue })
          }
        />
      </div>
    </div>
  )
}

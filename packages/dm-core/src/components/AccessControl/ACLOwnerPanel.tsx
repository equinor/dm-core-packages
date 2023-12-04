import { Icon, Input } from '@equinor/eds-core-react'
import { ACLSelect } from './ACLSelect'
import { AccessControlList, AccessLevel } from '../../services'
import React from 'react'
import { CenteredRow } from './AccessControlListComponent'
import { edit_text } from '@equinor/eds-icons'

interface IACLOwnerPanelProps {
  acl: AccessControlList
  handleChange: (data: Partial<AccessControlList>) => void
}

export const ACLOwnerPanel = ({
  acl,
  handleChange,
}: IACLOwnerPanelProps): React.ReactElement => {
  return (
    <>
      <CenteredRow width={'230px'}>
        Owner:
        <Input
          style={{ width: '150px', marginLeft: '5px' }}
          placeholder={acl.owner}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChange({ owner: event.target.value })
          }
        />
        <Icon data={edit_text} size={24} style={{ color: 'teal' }} />
      </CenteredRow>
      <CenteredRow width={'160px'}>
        Others:
        <ACLSelect
          value={acl.others || AccessLevel.NONE}
          handleChange={(newValue: AccessLevel) =>
            handleChange({ others: newValue })
          }
        />
      </CenteredRow>
    </>
  )
}

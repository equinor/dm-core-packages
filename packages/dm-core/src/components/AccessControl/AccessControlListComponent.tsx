import { Button, Checkbox, Icon, Progress, Tabs } from '@equinor/eds-core-react'
import { edit_text, save } from '@equinor/eds-icons'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { useDMSS } from '../../context/DMSSContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { AccessControlList, AccessLevel } from '../../services'
import { TUserIdMapping } from '../../types'
import {
  getTokenWithUserReadAccess,
  getUsernameMappingFromUserId,
  getUsernameMappingFromUsername,
} from '../../utils/UsernameConversion'
import { ACLOwnerPanel } from './ACLOwnerPanel'
import { ACLUserRolesPanel } from './ACLUserRolesPanel'

Icon.add({ edit_text, save })

const ACLWrapper = styled.div`
  max-width: 650px;
  padding: 10px;
`

type CenteredRowType = {
  width?: string
  even?: boolean
  justifyContent?: string
}

export const CenteredRow = styled.div<CenteredRowType>`
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-bottom: 10px;
  justify-content: ${(props: CenteredRowType) =>
    props.justifyContent || 'space-between'};
  width: ${(props: CenteredRowType) => props.width || 'inherit'};
  background-color: ${(props: CenteredRowType) => {
    if (props.even) return '#F7F7F7'
    return 'inherit'
  }};
`

export const AccessControlListComponent = (props: {
  documentId: string
  dataSourceId: string
}): React.ReactElement => {
  const { documentId, dataSourceId } = props

  const [activeTab, setActiveTab] = useState<number>(0)
  const [storeACLRecursively, setStoreACLRecursively] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingACLDocument, setLoadingACLDocument] = useState<boolean>(false)
  const [tokenWithReadAccess, setTokenWithReadAccess] = useState<string>('')
  const [refreshToken] = useLocalStorage('ROCP_refreshToken', '')
  const dmssAPI = useDMSS()

  const [documentACL, setDocumentACL] = useState<AccessControlList>({
    owner: '',
    roles: {},
    users: {},
    others: AccessLevel.READ,
  })

  const convertACLFromUserIdToUsername = async (
    acl: AccessControlList
  ): Promise<AccessControlList> => {
    const aclCopy: AccessControlList = JSON.parse(JSON.stringify(acl)) //deep copy the acl object

    const newUsers: { [key: string]: AccessLevel } = {}
    const users = aclCopy.users
    if (!users) {
      toast.error('No users in AccessControlList object!')
      return Promise.reject()
    } else {
      return Promise.all(
        Object.keys(users).map((usernameId: string) => {
          return getUsernameMappingFromUserId(usernameId, tokenWithReadAccess)
        })
      )
        .then((userIdMappings: TUserIdMapping[]) => {
          userIdMappings.map((userIdMapping: TUserIdMapping) => {
            newUsers[userIdMapping.username] = users[userIdMapping.userId]
          })
          aclCopy.users = newUsers
        })
        .then(() => {
          return getUsernameMappingFromUserId(
            aclCopy.owner,
            tokenWithReadAccess
          ).then((userIdMapping: TUserIdMapping) => {
            if (userIdMapping.username) {
              aclCopy.owner = userIdMapping.username
            } else {
              aclCopy.owner = userIdMapping.userId
            }

            return aclCopy
          })
        })
    }
  }

  const convertACLFromUsernameToUserId = (
    acl: AccessControlList
  ): Promise<AccessControlList> => {
    const aclCopy: AccessControlList = JSON.parse(JSON.stringify(acl)) //deep copy the acl object

    const newUsers: { [key: string]: AccessLevel } = {}
    const users = acl.users
    if (!users) {
      toast.error('No users in AccessControlList object!')
      return Promise.reject()
    } else {
      return Promise.all(
        Object.keys(users).map((username: string) => {
          return getUsernameMappingFromUsername(username, tokenWithReadAccess)
        })
      ).then((userIdMappings: TUserIdMapping[]) => {
        userIdMappings.map((userIdMapping: TUserIdMapping) => {
          newUsers[userIdMapping.userId] = users[userIdMapping.username]
        })
        aclCopy.users = newUsers
        return getUsernameMappingFromUsername(
          aclCopy.owner,
          tokenWithReadAccess
        ).then((userIdMapping: TUserIdMapping) => {
          if (userIdMapping.userId) {
            aclCopy.owner = userIdMapping.userId
          } else {
            aclCopy.owner = userIdMapping.username
          }
          return aclCopy
        })
      })
    }
  }

  useEffect(() => {
    if (tokenWithReadAccess !== '') {
      setLoadingACLDocument(true)
      dmssAPI
        .getAcl({
          dataSourceId: dataSourceId,
          documentId: documentId,
        })
        .then((response: AxiosResponse<AccessControlList>) => {
          const acl = response.data
          convertACLFromUserIdToUsername(acl)
            .then((newACL: AccessControlList) => {
              setDocumentACL(newACL)
            })
            .catch((error) => {
              toast.error(
                `Could not convert username ID to username (${error})`
              )
            })
            .finally(() => {
              setLoadingACLDocument(false)
            })
        })
        .catch((error: AxiosError<any>) => {
          if (error.response) {
            toast.error(
              `Could not fetch AccessControlList for this document (${
                error.response.data || error.message
              })`
            )
          } else {
            console.error(error)
          }
        })
    }
  }, [tokenWithReadAccess])

  useEffect(() => {
    if (typeof refreshToken === 'string') {
      getTokenWithUserReadAccess(refreshToken).then((token: string) => {
        setTokenWithReadAccess(token)
      })
    } else {
      throw new Error('Refresh token not found')
    }
  }, [documentId])

  async function saveAccessControlList(acl: AccessControlList) {
    setLoading(true)
    convertACLFromUsernameToUserId(acl)
      .then((newACL) => {
        dmssAPI
          .setAcl({
            dataSourceId: dataSourceId,
            documentId: documentId,
            accessControlList: newACL,
            recursively: storeACLRecursively,
          })
          .then(() => {
            toast.success('AccessControlList saved!')
          })
      })
      .catch((error) => {
        toast.error(`Could not save AccessControlList (${error})`)
      })
      .finally(() => setLoading(false))
  }

  function handleChange(value: Partial<AccessControlList>) {
    setDocumentACL({ ...documentACL, ...value })
  }

  if (
    loadingACLDocument ||
    documentACL.users === undefined ||
    documentACL.roles === undefined
  )
    return (
      <Progress.Circular
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      />
    )

  return (
    <ACLWrapper>
      <Tabs
        activeTab={activeTab}
        onChange={(index: number) => setActiveTab(index)}
        variant="fullWidth"
      >
        <Tabs.List>
          <Tabs.Tab>Owner</Tabs.Tab>
          <Tabs.Tab>Roles</Tabs.Tab>
          <Tabs.Tab>Users</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <ACLOwnerPanel acl={documentACL} handleChange={handleChange} />
          </Tabs.Panel>
          <Tabs.Panel>
            <ACLUserRolesPanel
              aclKey="roles"
              entities={documentACL.roles}
              handleChange={handleChange}
            />
          </Tabs.Panel>
          <Tabs.Panel>
            <ACLUserRolesPanel
              aclKey="users"
              entities={documentACL.users}
              handleChange={handleChange}
            />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>

      <CenteredRow>
        <Button onClick={() => saveAccessControlList(documentACL)}>
          {(loading && <Progress.Dots color="neutral" />) || 'Save'}
          {!loading && <Icon name="save" title="save" size={24} />}
        </Button>
        <Checkbox
          checked={storeACLRecursively}
          label="Change access recursively"
          onClick={() => setStoreACLRecursively(!storeACLRecursively)}
        ></Checkbox>
      </CenteredRow>
    </ACLWrapper>
  )
}

export default AccessControlListComponent

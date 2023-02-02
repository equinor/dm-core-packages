import {
  Button,
  Dialog,
  DmssAPI,
  IUIPlugin,
  Loading,
  useDocument,
} from '@development-framework/dm-core'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Icon, Radio, TopBar } from '@equinor/eds-core-react'

// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { AxiosResponse } from 'axios'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useLocalStorage } from './useLocalStorage'
import { account_circle, grid_on, info_circle } from '@equinor/eds-icons'

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  > * {
    margin-left: 40px;
  }
`

const AppSelectorWrapper = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  min-width: 300px;
  max-width: 300px;
  background: #ffffff;
  border: 1px solid gray;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  width: min-content;
`

const AppBox = styled.div`
  border: 3px solid grey;
  padding: 8px;
  margin: 5px;
  height: 80px;
  width: 80px;
  background: #b3dae0;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #4f878d;
  }
`
const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

const UserInfoLabel = styled.b`
  margin-left: 5px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: inline-flex;
`

type THeaderPluginConfig = {
  hideUserInfo: boolean
  hideAbout: boolean
}

type TApplication = {
  name: string
  dataSources: string[]
  label: string
  description: string
  roles: string[]
  adminRole: string
}

export default (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig } = props
  const config: THeaderPluginConfig = passedConfig
  const [entity, isLoading] = useDocument<TApplication>(idReference)
  const { tokenData, token, logOut } = useContext(AuthContext)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const [apiKey, setAPIKey] = useState<string | null>(null)
  const dmssApi = new DmssAPI(token)
  const [checked, updateChecked] = useLocalStorage<string | null>(
    'impersonateRoles',
    null
  )

  if (isLoading || !entity) {
    return <Loading />
  }

  return (
    <TopBar>
      <TopBar.Header>
        {/*<ClickableIcon onClick={() => setAppSelectorOpen(!appSelectorOpen)}>*/}
        <Icon data={grid_on} size={32} />
        {/*</ClickableIcon>*/}
        <h4 style={{ paddingTop: 9, paddingLeft: 10 }}>{entity.label}</h4>
        {/*{appSelectorOpen && (*/}
        {/*  <AppSelectorWrapper>*/}
        {/*    {entity.dataSources.map((app) => (*/}
        {/*      <Link to={`/${app.urlPath}`} key={app.name}>*/}
        {/*        <AppBox>{app?.label ? app.label : app.name}</AppBox>*/}
        {/*      </Link>*/}
        {/*    ))}*/}
        {/*    <Link to={'/DMT/search'}>*/}
        {/*      <AppBox>Search</AppBox>*/}
        {/*    </Link>*/}
        {/*  </AppSelectorWrapper>*/}
        {/*)}*/}
      </TopBar.Header>
      <TopBar.Actions>
        <Icons>
          <ClickableIcon
            onClick={() => setAboutOpen(true)}
            hidden={config?.hideAbout}
          >
            <Icon data={info_circle} size={24} title="About" />
          </ClickableIcon>
          <ClickableIcon
            onClick={() => setVisibleUserInfo(true)}
            hidden={config?.hideUserInfo}
          >
            <Icon data={account_circle} size={24} title="User" />
          </ClickableIcon>
        </Icons>
      </TopBar.Actions>
      <TopBar.CustomContent>
        <Dialog
          isOpen={aboutOpen}
          closeScrim={() => setAboutOpen(false)}
          header={`About ${entity.label}`}
          width={'40vw'}
        >
          <p style={{ padding: '0 15px' }}>{entity.description}</p>
        </Dialog>
        <Dialog
          isOpen={visibleUserInfo}
          header={'User info'}
          closeScrim={() => setVisibleUserInfo(false)}
          width={'720px'}
        >
          <div style={{ margin: '20px' }}>
            <Row>
              Name:<UserInfoLabel>{tokenData?.name}</UserInfoLabel>
            </Row>
            <Row>
              Username:
              <UserInfoLabel>{tokenData?.preferred_username}</UserInfoLabel>
            </Row>
            <Row>
              Roles:{' '}
              <UserInfoLabel>{JSON.stringify(tokenData?.roles)}</UserInfoLabel>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(token)
                  NotificationManager.success('Copied token to clipboard')
                }}
              >
                Copy token to clipboard
              </Button>
              <Button
                onClick={() =>
                  dmssApi
                    .tokenCreate()
                    .then((response: AxiosResponse<string>) =>
                      setAPIKey(response.data)
                    )
                    .catch((error: any) => {
                      console.error(error)
                      NotificationManager.error(
                        'Failed to create personal access token'
                      )
                    })
                }
              >
                Create API-Key
              </Button>
              <Button onClick={() => logOut()}>Log out</Button>
            </div>
            {apiKey && <pre>{apiKey}</pre>}

            {tokenData?.roles.includes(entity.adminRole) && (
              <>
                <p>Impersonate a role (UI only)</p>
                <UnstyledList>
                  {entity.roles.map((role: string) => (
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
          </div>
        </Dialog>
      </TopBar.CustomContent>
    </TopBar>
  )
}

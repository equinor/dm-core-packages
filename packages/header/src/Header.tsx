import { IUIPlugin, Loading, useDocument } from '@development-framework/dm-core'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, TopBar } from '@equinor/eds-core-react'

// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { account_circle, grid_on, info_circle } from '@equinor/eds-icons'
import { UserInfoDialog } from './components/UserInfoDialog'
import { AboutDialog } from './components/AboutDialog'
import { TApplication } from './types'

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

type THeaderPluginConfig = {
  hideUserInfo: boolean
  hideAbout: boolean
}

export default (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig } = props
  const config: THeaderPluginConfig = passedConfig
  const [entity, isLoading] = useDocument<TApplication>(idReference)

  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const [apiKey, setAPIKey] = useState<string | null>(null)

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
        <AboutDialog
          isOpen={aboutOpen}
          setIsOpen={setAboutOpen}
          applicationEntity={entity}
        />
        <UserInfoDialog
          isOpen={visibleUserInfo}
          setIsOpen={setVisibleUserInfo}
          applicationEntity={entity}
        />
      </TopBar.CustomContent>
    </TopBar>
  )
}

import {
  IUIPlugin,
  Loading,
  UiPluginContext,
  useDocument,
  useBlueprint,
  TUiRecipe,
} from '@development-framework/dm-core'
import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Icon, TopBar } from '@equinor/eds-core-react'

import { account_circle, grid_on, info_circle } from '@equinor/eds-icons'

import { UserInfoDialog } from './components/UserInfoDialog'
import { AboutDialog } from './components/AboutDialog'
import { TApplication } from './types'
import { PluginSelector } from './components/PluginSelector'

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  > * {
    margin-left: 40px;
  }
`

const ClickableIcon = styled.div`
  &:hover {
    color: gray;
    cursor: pointer;
  }
`

type THeaderPluginConfig = {
  uiRecipesList: string[]
  hideUserInfo: boolean
  hideAbout: boolean
}

export default (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig, type } = props
  const config = passedConfig as THeaderPluginConfig
  const [entity, isApplicationLoading] = useDocument<TApplication>(idReference)
  const { uiRecipes, isLoading: isBlueprintLoading } = useBlueprint(type)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const { loading: isContextLoading, getUiPlugin } = useContext(UiPluginContext)

  const [selectedPlugin, setSelectedPlugin] = useState<{
    component: (props: IUIPlugin) => JSX.Element
  }>({
    component: (props: IUIPlugin) => <div></div>,
  })

  useEffect(() => {
    if (isContextLoading === false && isBlueprintLoading === false) {
      const defaultPluginName: string =
        config.uiRecipesList.length > 0
          ? uiRecipes.find((recipe: TUiRecipe) => {
              return recipe.name === config.uiRecipesList[0]
            }).plugin
          : uiRecipes[0].plugin
      setSelectedPlugin({ component: getUiPlugin(defaultPluginName) })
    }
  }, [isBlueprintLoading, isContextLoading])

  const UIPlugin: (props: IUIPlugin) => JSX.Element = selectedPlugin.component
  if (
    isApplicationLoading ||
    !entity ||
    isContextLoading ||
    isBlueprintLoading
  ) {
    return <Loading />
  }

  return (
    <div>
      <TopBar>
        <TopBar.Header>
          <ClickableIcon
            onClick={() => {
              setAppSelectorOpen(!appSelectorOpen)
            }}
          >
            <Icon data={grid_on} size={32} />
          </ClickableIcon>
          <h4 style={{ paddingTop: 9, paddingLeft: 10 }}>{entity.label}</h4>
          {appSelectorOpen && (
            <PluginSelector
              selectableUiRecipeNames={
                config.uiRecipesList.length > 0
                  ? config.uiRecipesList
                  : uiRecipes.map((recipe: TUiRecipe) => recipe.name)
              }
              availableUiRecipes={uiRecipes}
              setSelectedUiPlugin={(uiPluginName) => {
                setAppSelectorOpen(false)
                setSelectedPlugin({ component: getUiPlugin(uiPluginName) })
              }}
            />
          )}
        </TopBar.Header>
        <TopBar.Actions>
          <Icons>
            <ClickableIcon
              onClick={() => setAboutOpen(true)}
              hidden={config.hideAbout}
            >
              <Icon data={info_circle} size={24} title="About" />
            </ClickableIcon>
            <ClickableIcon
              onClick={() => setVisibleUserInfo(true)}
              hidden={config.hideUserInfo}
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
      <UIPlugin idReference={idReference} type={entity.type} config={config} />
    </div>
  )
}

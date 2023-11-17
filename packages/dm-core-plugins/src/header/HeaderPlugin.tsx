import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TUiRecipe,
  useBlueprint,
  useDocument,
  useUiPlugins,
} from '@development-framework/dm-core'
import { Icon, Menu, TopBar } from '@equinor/eds-core-react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { account_circle, menu, info_circle } from '@equinor/eds-icons'

import { AboutDialog } from './components/AboutDialog'
import { UserInfoDialog } from './components/UserInfoDialog'
import { TApplication } from './types'

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  > * {
    margin-left: 40px;
  }
`

const ClickableIcon = styled.button`
  appearance: none;
  border: none;
  background-color: transparent;

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

const defaultHeaderPluginConfig = {
  uiRecipesList: [],
  hideUserInfo: false,
  hideAbout: false,
}

type TRecipeConfigAndPlugin = {
  config?: TGenericObject
  component: (props: IUIPlugin) => React.ReactElement
}

export default (props: IUIPlugin): React.ReactElement => {
  const { idReference, config: passedConfig, type } = props
  const config: THeaderPluginConfig = {
    ...defaultHeaderPluginConfig,
    ...passedConfig,
  }
  const { document: entity, isLoading } = useDocument<TApplication>(idReference)
  const { uiRecipes, isLoading: isBlueprintLoading } = useBlueprint(type)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { getUiPlugin } = useUiPlugins()

  const [selectedRecipe, setSelectedRecipe] = useState<TRecipeConfigAndPlugin>({
    component: () => <div></div>,
    config: {},
  })

  function getRecipeConfigAndPlugin(
    recipeName: string
  ): TRecipeConfigAndPlugin {
    const recipe = uiRecipes.find(
      (recipe: TUiRecipe) => recipe.name === recipeName
    )
    return {
      component: getUiPlugin(recipe.plugin),
      config: recipe?.config ?? {},
    }
  }

  useEffect(() => {
    if (!isBlueprintLoading) {
      const defaultRecipe: TUiRecipe = config.uiRecipesList.length
        ? uiRecipes.find(
            (recipe: TUiRecipe) => recipe.name === config.uiRecipesList[0]
          )
        : uiRecipes[0]
      setSelectedRecipe(getRecipeConfigAndPlugin(defaultRecipe.name))
    }
  }, [isBlueprintLoading])

  const UIPlugin: (props: IUIPlugin) => React.ReactElement =
    selectedRecipe.component
  if (isLoading || !entity || isBlueprintLoading) {
    return <Loading />
  }

  const recipeNames: string[] =
    config.uiRecipesList.length > 0
      ? config.uiRecipesList
      : uiRecipes.map((recipe: TUiRecipe) => recipe.name)

  return (
    <div>
      <TopBar
        style={{
          display: 'flex',
          justifyItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <TopBar.Header style={{ position: 'relative' }}>
          <ClickableIcon
            ref={setAnchorEl}
            onClick={() => {
              setAppSelectorOpen(!appSelectorOpen)
            }}
            style={{ paddingTop: '5px' }}
          >
            <Icon data={menu} size={32} title="Menu" />
          </ClickableIcon>
          <Menu open={appSelectorOpen} anchorEl={anchorEl}>
            {recipeNames.map((recipe: string, index: number) => (
              <Menu.Item
                key={index}
                onClick={() => {
                  setSelectedRecipe(getRecipeConfigAndPlugin(recipe))
                  setAppSelectorOpen(false)
                }}
              >
                {recipe}
              </Menu.Item>
            ))}
          </Menu>
          <h4 style={{ paddingLeft: 10 }}>{entity.label}</h4>
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
      </TopBar>
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
      <UIPlugin
        idReference={idReference}
        type={entity.type}
        config={selectedRecipe.config}
      />
    </div>
  )
}

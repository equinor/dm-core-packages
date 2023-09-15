import {
  IUIPlugin,
  Loading,
  TGenericObject,
  TUiRecipe,
  useBlueprint,
  useDocument,
  useUiPlugins,
} from '@development-framework/dm-core'
import {Icon, TopBar, Typography} from '@equinor/eds-core-react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { account_circle, grid_on, info_circle } from '@equinor/eds-icons'

import { AboutDialog } from './components/AboutDialog'
import { RecipeSelector } from './components/RecipeSelector'
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

const defaultHeaderPluginConfig = {
  uiRecipesList: [],
  hideUserInfo: false,
  hideAbout: false,
}

type TRecipeConfigAndPlugin = {
  config?: TGenericObject
  component: (props: IUIPlugin) => JSX.Element
}

export default (props: IUIPlugin): JSX.Element => {
  const { idReference, config: passedConfig, type } = props
  const config: THeaderPluginConfig = {
    ...defaultHeaderPluginConfig,
    ...passedConfig,
  }
  const [entity, isApplicationLoading] = useDocument<TApplication>(idReference)
  const { uiRecipes, isLoading: isBlueprintLoading } = useBlueprint(type)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false)
  const [appSelectorOpen, setAppSelectorOpen] = useState<boolean>(false)
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
      const defaultRecipe: TUiRecipe =
        config.uiRecipesList.length > 0
          ? uiRecipes.find(
              (recipe: TUiRecipe) => recipe.name === config.uiRecipesList[0]
            )
          : uiRecipes[0]
      setSelectedRecipe(getRecipeConfigAndPlugin(defaultRecipe.name))
    }
  }, [isBlueprintLoading])

  const UIPlugin: (props: IUIPlugin) => JSX.Element = selectedRecipe.component
  if (isApplicationLoading || !entity || isBlueprintLoading) {
    return <Loading />
  }

  return (
    <div>
      <TopBar style={{marginBottom: '8px'}}>
        <TopBar.Header>
          <ClickableIcon
            onClick={() => {
              setAppSelectorOpen(!appSelectorOpen)
            }}
          >
            <Icon data={grid_on} size={32} />
          </ClickableIcon>
          <Typography variant="h4" style={{ paddingLeft: 10 }}>{entity.label}</Typography>
          {appSelectorOpen && (
            <RecipeSelector
              selectableUiRecipeNames={
                config.uiRecipesList.length > 0
                  ? config.uiRecipesList
                  : uiRecipes.map((recipe: TUiRecipe) => recipe.name)
              }
              setSelectedUiRecipe={(uiRecipeName: string) => {
                setAppSelectorOpen(false)
                setSelectedRecipe(getRecipeConfigAndPlugin(uiRecipeName))
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
      <UIPlugin
        idReference={idReference}
        type={entity.type}
        config={selectedRecipe.config}
      />
    </div>
  )
}

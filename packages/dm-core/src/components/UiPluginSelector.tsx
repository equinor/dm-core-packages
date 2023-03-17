import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import { UiPluginContext } from '../context/UiPluginContext'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getRoles } from '../utils/appRoles'
import { ErrorBoundary } from '../utils/ErrorBoundary'
import { useBlueprint } from '../hooks'
import { IUIPlugin, TUiRecipe } from '../types'

const lightGray = '#d3d3d3'

const PluginTabsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

const PathWrapper = styled.div`
  display: flex;
  opacity: 60%;
  justify-content: center;
  font-size: 14px;
  height: 20px;
  overflow: hidden;
`

const PathPartLink = styled.a`
  color: #007079;

  &:hover {
    color: #004f55;
    font-weight: bold;
  }
`

const PathPart = styled.div`
  margin-top: 0;
  margin-right: 15px;
`

const getHref = (
  dataSource: string,
  parts: string[],
  index: number
): string => {
  // Get the HREF for the document
  return parts.slice(0, index + 1).join('.')
}

export function DocumentPath(props: { absoluteDottedId: string }): JSX.Element {
  const { absoluteDottedId } = props
  const [dataSource, documentDottedId] = absoluteDottedId.split('/')
  const parts = documentDottedId.split('.')
  return (
    <PathWrapper>
      <PathPart>{dataSource}</PathPart>
      {parts.map((part: string, index: number) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'nowrap' }} key={part}>
            <PathPart>/</PathPart>
            <PathPart
              as={PathPartLink}
              href={getHref(dataSource, parts, index)}
            >
              {part}
            </PathPart>
          </div>
        )
      })}
    </PathWrapper>
  )
}

interface ISPButton {
  active: boolean
}

const SelectPluginButton = styled.div<ISPButton>`
  padding: 5px 10px;
  text-align: center;
  width: 100%;
  border-bottom: ${(props: any) =>
    (props.active == true && '2px #017078FF solid') ||
    `2px ${lightGray} solid`};

  &:hover {
    background: ${lightGray};
    cursor: pointer;
  }
`

type TSelectablePlugins = {
  name: string
  component: (props: IUIPlugin) => JSX.Element
  config: any
}

type TUiPluginSelectorConfig = {
  recipes: string[]
  breadcrumb?: boolean
  referencedBy?: string
}

function filterPlugins(
  uiRecipes: TUiRecipe[],
  roles: string[],
  getUIPlugin: (pluginName: string) => (props: IUIPlugin) => JSX.Element,
  config?: TUiPluginSelectorConfig
): TSelectablePlugins[] {
  const fallbackPlugin: TSelectablePlugins[] = [
    { name: 'yaml', component: getUIPlugin('yaml'), config: {} },
  ]

  // Blueprint has no recipes
  if (!uiRecipes.length) return fallbackPlugin

  uiRecipes = uiRecipes.filter((recipe: TUiRecipe) => {
    // If no role filter on recipe, keep it. Else, only keep it if one of the active roles match one of the roles
    // given in recipe
    if (recipe?.roles && recipe.roles.length) {
      return (
        // @ts-ignore
        roles.filter((activeRole: string) => recipe.roles.includes(activeRole))
          .length > 0
      )
    }
    return true
  })

  // Filter on recipes from config
  if (config?.recipes) {
    uiRecipes = uiRecipes.filter((recipe: TUiRecipe) =>
      config.recipes.includes(recipe.name)
    )
  }

  // If there are no recipes with the correct filter, show fallback
  if (!uiRecipes.length) {
    return fallbackPlugin
  }

  // Return the remaining recipes
  return uiRecipes.map((uiRecipe: any) => ({
    name: uiRecipe?.label || uiRecipe?.name || uiRecipe?.plugin || 'No name',
    component: getUIPlugin(uiRecipe?.plugin),
    config: uiRecipe?.config,
  }))
}

export function UIPluginSelector(props: IUIPlugin): JSX.Element {
  const { idReference, type, onSubmit, onOpen, config } = props
  const { uiRecipes, isLoading: isBlueprintLoading, error } = useBlueprint(type)
  const { loading: isContextLoading, getUiPlugin } = useContext(UiPluginContext)
  const { tokenData } = useContext(AuthContext)
  const roles = getRoles(tokenData)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectablePlugins, setSelectablePlugins] = useState<
    TSelectablePlugins[]
  >([])

  useEffect(() => {
    // Make sure uiRecipes and ui plugins have been loaded
    if (isBlueprintLoading || isContextLoading) return
    setSelectablePlugins(filterPlugins(uiRecipes, roles, getUiPlugin, config))
  }, [uiRecipes, isContextLoading, isBlueprintLoading])

  if (isBlueprintLoading || isContextLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (error)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {type || '(unknown type)'}
      </div>
    )
  if (!selectablePlugins.length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const UiPlugin: (props: IUIPlugin) => JSX.Element =
    selectablePlugins[selectedPlugin].component

  return (
    <Wrapper>
      {config && config.breadcrumb && (
        <DocumentPath absoluteDottedId={idReference} />
      )}
      {config && config.referencedBy && (
        <DocumentPath absoluteDottedId={config.referencedBy} />
      )}
      {selectablePlugins.length > 1 && (
        <PluginTabsWrapper>
          {selectablePlugins.map(
            (component: TSelectablePlugins, index: number) => (
              <SelectPluginButton
                key={index}
                onClick={() => setSelectedPlugin(index)}
                active={index === selectedPlugin}
              >
                {component.name}
              </SelectPluginButton>
            )
          )}
        </PluginTabsWrapper>
      )}
      {/*@ts-ignore*/}
      <ErrorBoundary
        key={selectablePlugins[selectedPlugin].name}
        message={`Plugin '${selectablePlugins[selectedPlugin].name}' crashed...`}
      >
        <UiPlugin
          idReference={idReference}
          type={type}
          onSubmit={onSubmit}
          onOpen={onOpen}
          config={selectablePlugins[selectedPlugin].config}
        />
      </ErrorBoundary>
    </Wrapper>
  )
}

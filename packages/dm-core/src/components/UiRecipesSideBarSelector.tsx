import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import { UiPluginContext } from '../context/UiPluginContext'
import { ErrorBoundary } from '../utils/ErrorBoundary'
import { useBlueprint } from '../hooks'
import { IUIPlugin } from '../types'

const lightGray = '#d3d3d3'

const RecipeSidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  border-right: 2px black solid;
`

const Wrapper = styled.div`
  align-self: start;
  width: 100%;
  display: flex;
`

interface ISPButton {
  active: boolean
}

const SelectPluginButton = styled.div<ISPButton>`
  padding: 5px 10px;
  margin: 10px;
  text-align: center;
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

export function UiRecipesSideBarSelector(props: IUIPlugin): JSX.Element {
  const { idReference, onSubmit, onOpen, type } = props
  const { loading: isContextLoading, getUiPlugin } = useContext(UiPluginContext)
  const { uiRecipes, isLoading: isBlueprintLoading } = useBlueprint(type)
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0)
  const [selectableRecipes, setSelectableRecipes] = useState<
    TSelectablePlugins[]
  >([])

  useEffect(() => {
    // Make sure ui plugins have been loaded
    if (isContextLoading || isBlueprintLoading) return
    const recipes = uiRecipes.map(
      (uiRecipe: any): TSelectablePlugins => ({
        name:
          uiRecipe?.label || uiRecipe?.name || uiRecipe?.plugin || 'No name',
        component: getUiPlugin(uiRecipe?.plugin),
        config: uiRecipe?.config,
      })
    )
    setSelectableRecipes(recipes)
  }, [isContextLoading, isBlueprintLoading, uiRecipes])

  if (isContextLoading || isBlueprintLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (!selectableRecipes.length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const UiPlugin: (props: IUIPlugin) => JSX.Element =
    selectableRecipes[selectedRecipe].component

  return (
    <Wrapper>
      <RecipeSidebarWrapper>
        {selectableRecipes.map(
          (component: TSelectablePlugins, index: number) => (
            <SelectPluginButton
              key={index}
              onClick={() => setSelectedRecipe(index)}
              active={index === selectedRecipe}
            >
              {component.name}
            </SelectPluginButton>
          )
        )}
      </RecipeSidebarWrapper>
      {/*@ts-ignore*/}
      <ErrorBoundary
        fallBack={() => (
          <h4 style={{ color: 'red' }}>
            The UiPlugin <i>{selectableRecipes[selectedRecipe].name}</i>{' '}
            crashed...
          </h4>
        )}
      >
        <UiPlugin
          idReference={idReference}
          type={type}
          onSubmit={onSubmit}
          onOpen={onOpen}
          config={selectableRecipes[selectedRecipe].config}
        />
      </ErrorBoundary>
    </Wrapper>
  )
}

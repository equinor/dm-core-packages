import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import { IUIPlugin, UiPluginContext } from '../context/UiPluginContext'
import { ErrorBoundary } from '../utils/ErrorBoundary'

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

export function UiRecipesSideBarSelector(props: {
  idReference: string
  type: string
  onSubmit?: (data: any) => void
  categories?: string[]
  onOpen?: (data: any) => void
  config?: any
}): JSX.Element {
  const { idReference, categories, onSubmit, onOpen, config } = props
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const [selectedPlugin, setSelectedPlugin] = useState<number>(0)
  const [selectablePlugins, setSelectablePlugins] = useState<
    TSelectablePlugins[]
  >([])

  useEffect(() => {
    // Make sure ui plugins have been loaded
    if (loading) return
    const selectAbleRecipes = config.uiRecipes.map((uiRecipe: any) => ({
      name: uiRecipe?.label || uiRecipe?.name || uiRecipe?.plugin || 'No name',
      component: getUiPlugin(uiRecipe?.plugin).component,
      config: uiRecipe?.config,
    }))
    setSelectablePlugins(selectAbleRecipes)
  }, [loading])

  if (loading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (!selectablePlugins.length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const UiPlugin: (props: IUIPlugin) => JSX.Element =
    selectablePlugins[selectedPlugin].component
  const recipeConfig: any = selectablePlugins[selectedPlugin].config

  return (
    <Wrapper>
      <RecipeSidebarWrapper>
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
      </RecipeSidebarWrapper>
      <ErrorBoundary
        fallBack={() => (
          <h4 style={{ color: 'red' }}>
            The UiPlugin <i>{selectablePlugins[selectedPlugin].name}</i>{' '}
            crashed...
          </h4>
        )}
      >
        <UiPlugin
          idReference={idReference}
          onSubmit={onSubmit}
          onOpen={onOpen}
          categories={categories}
          config={recipeConfig}
        />
      </ErrorBoundary>
    </Wrapper>
  )
}

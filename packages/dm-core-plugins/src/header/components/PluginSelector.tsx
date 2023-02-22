import React from 'react'
import styled from 'styled-components'
import { TUiRecipe } from '@development-framework/dm-core'

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

type PluginSelectorProps = {
  selectableUiRecipeNames: string[]
  setSelectedUiPlugin: (uiPluginName: string) => void
  availableUiRecipes: TUiRecipe[]
}
export const PluginSelector = (props: PluginSelectorProps) => {
  const {
    selectableUiRecipeNames,
    setSelectedUiPlugin,
    availableUiRecipes,
  } = props

  return (
    <AppSelectorWrapper>
      {selectableUiRecipeNames.map((recipeName: string, index: number) => (
        <AppBox
          key={index}
          onClick={() => {
            availableUiRecipes.map((recipe) => {
              if (recipe.name === recipeName) {
                setSelectedUiPlugin(recipe.plugin)
              }
            })
          }}
        >
          {recipeName}
        </AppBox>
      ))}
    </AppSelectorWrapper>
  )
}

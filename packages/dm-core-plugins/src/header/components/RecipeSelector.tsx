import React from 'react'
import styled from 'styled-components'

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

type RecipeSelectorProps = {
  selectableUiRecipeNames: string[]
  setSelectedUiRecipe: (uiRecipeName: string) => void
}
export const RecipeSelector = (props: RecipeSelectorProps) => {
  const { selectableUiRecipeNames, setSelectedUiRecipe } = props

  return (
    <AppSelectorWrapper>
      {selectableUiRecipeNames.map((recipeName: string) => (
        <AppBox
          key={recipeName}
          onClick={() => setSelectedUiRecipe(recipeName)}
        >
          {recipeName}
        </AppBox>
      ))}
    </AppSelectorWrapper>
  )
}

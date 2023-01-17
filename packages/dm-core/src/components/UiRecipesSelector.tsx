import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import { useBlueprint } from '../hooks'
import { UIPluginSelector } from './UiPluginSelector'
import { UiRecipesSideBarSelector } from './UiRecipesSideBarSelector'

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

export function UIRecipesSelector(props: {
  idReference: string
  type: string
}): any {
  const { idReference, type } = props
  const { uiRecipe, isLoading, error } = useBlueprint(type)
  const [recipeSelector, setRecipeSelector] = useState<any>()

  useEffect(() => {
    // Make sure uiRecipe has been loaded
    if (isLoading) return
    let Component

    switch (uiRecipe.plugin) {
      case 'UiPluginSelector':
        Component = UiRecipesSideBarSelector
        // Component = UIPluginSelector
        break
      case 'UiRecipesSideBarSelector':
        Component = UiRecipesSideBarSelector
        break
      default:
        Component = UiRecipesSideBarSelector
      // Component = UIPluginSelector
    }
    setRecipeSelector({ component: Component })
  }, [uiRecipe, isLoading])

  if (isLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {type || '(unknown type)'}
      </div>
    )
  }

  if (!recipeSelector)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const Selector: (props: any) => JSX.Element = recipeSelector.component

  return (
    <div>
      <Selector idReference={idReference} config={uiRecipe.config} />
      <UIPluginSelector type={type} idReference={idReference} />
    </div>
  )
}

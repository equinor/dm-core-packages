import React, { useEffect, useState, useContext } from 'react'

import styled from 'styled-components'
import { CircularProgress } from '@equinor/eds-core-react'
import { useBlueprint } from '../hooks'
import { UIPluginSelector } from './UiPluginSelector'
import { UiRecipesSideBarSelector } from './UiRecipesSideBarSelector'
import { UiPluginContext } from '../context/UiPluginContext'
import { IUIPlugin } from '../types'

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

export function UIRecipesSelector(props: IUIPlugin): JSX.Element {
  const { idReference, type } = props
  const { initialUiRecipe, isLoading, error } = useBlueprint(type)
  const { loading, getUiPlugin } = useContext(UiPluginContext)
  const [initialPlugin, setInitialPlugin] = useState<any>()

  useEffect(() => {
    // Make sure uiRecipes has been loaded
    if (isLoading || loading) return
    let Component

    if (!initialUiRecipe) {
      setInitialPlugin({ component: UIPluginSelector })
      return
    }

    switch (initialUiRecipe.plugin) {
      case 'UiPluginSelector':
        Component = UIPluginSelector
        break
      case 'UiRecipesSideBarSelector':
        Component = UiRecipesSideBarSelector
        break
      default:
        Component = getUiPlugin(initialUiRecipe.plugin).component
    }
    setInitialPlugin({ component: Component })
  }, [initialUiRecipe, isLoading, loading])

  if (isLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <CircularProgress color="primary" />
      </div>
    )

  if (error) {
    console.error(error)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {type || '(unknown type)'}
      </div>
    )
  }

  if (!initialPlugin)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const Selector: (props: any) => JSX.Element = initialPlugin.component

  return (
    <Selector
      idReference={idReference}
      config={initialUiRecipe?.config}
      type={type}
    />
  )
}

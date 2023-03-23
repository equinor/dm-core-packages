import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { useBlueprint } from '../hooks'
import {
  IUIPlugin,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TUiRecipe,
} from '../types'
import { Loading } from './Loading'
import { ViewCreator } from './ViewCreator'

const lightGray = '#acb7da'

const TabsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`

interface ITabButton {
  active: boolean
}

const TabButton = styled.div<ITabButton>`
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

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

type IUiRecipesSelectorConfig = {
  views?: (TReferenceViewConfig | TInlineRecipeViewConfig)[]
}

export function RecipeSelector(
  props: IUIPlugin & { config: IUiRecipesSelectorConfig }
): JSX.Element {
  const { idReference, type, config } = props
  const { uiRecipes, isLoading: isBlueprintLoading, error } = useBlueprint(type)

  const [selectedView, setSelectedView] = useState<number>(0)
  const [selectableViews, setSelectableViews] = useState<
    (TReferenceViewConfig | TInlineRecipeViewConfig)[]
  >([])

  useEffect(() => {
    if (isBlueprintLoading) return

    if (config.views && config.views.length) {
      setSelectableViews(config.views)
    } else {
      // If no views are passed. Create from recipes
      const newSelectableViews: (
        | TReferenceViewConfig
        | TInlineRecipeViewConfig
      )[] = []
      uiRecipes.forEach((recipe: TUiRecipe) => {
          // Avoid recursive loop
        if (recipe.plugin !== 'recipe-selector')
          newSelectableViews.push({
            type: 'InlineRecipeViewConfig',
            recipe: recipe,
            scope: 'self',
          })
      })
      setSelectableViews(newSelectableViews)
    }
  }, [uiRecipes, isBlueprintLoading])

  if (isBlueprintLoading) return <Loading />

  if (error) throw new Error(JSON.stringify(error))

  if (!selectableViews.length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  return (
    <Wrapper>
      <TabsWrapper>
        {selectableViews.map(
          (
            viewConfig: TReferenceViewConfig | TInlineRecipeViewConfig,
            index: number
          ) => (
            <TabButton
              key={index}
              onClick={() => setSelectedView(index)}
              active={index === selectedView}
            >
              {/*@ts-ignore*/}
              {viewConfig.recipe?.name ?? viewConfig.recipe}
            </TabButton>
          )
        )}
      </TabsWrapper>
      <ViewCreator
        idReference={idReference}
        viewConfig={selectableViews[selectedView]}
      />
    </Wrapper>
  )
}

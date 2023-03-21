import React from 'react'

import styled from 'styled-components'
import { ErrorBoundary } from '../utils/ErrorBoundary'
import { useRecipe } from '../hooks'
import { IUIPlugin } from '../types'
import { Loading } from './Loading'

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

type IEntityView = IUIPlugin & { recipeName?: string }

export const EntityView = (props: IEntityView): JSX.Element => {
  const { idReference, type, onSubmit, onOpen, recipeName } = props
  const { recipe, isLoading, error, getUiPlugin } = useRecipe(type, recipeName)

  if (isLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <Loading />
      </div>
    )

  if (error)
    return (
      <div style={{ color: 'red' }}>
        Failed to fetch Blueprint {type || '(unknown type)'}
      </div>
    )

  if (!recipe || !Object.keys(recipe).length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const UiPlugin = getUiPlugin(recipe.plugin)

  return (
    <Wrapper>
      {/*@ts-ignore*/}
      <ErrorBoundary message={`Plugin "${recipe.plugin}" crashed...`}>
        <UiPlugin
          idReference={idReference}
          type={type}
          onSubmit={onSubmit}
          onOpen={onOpen}
          config={recipe.config || {}}
        />
      </ErrorBoundary>
    </Wrapper>
  )
}

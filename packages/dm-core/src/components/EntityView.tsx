import React from 'react'

import styled from 'styled-components'
import { ErrorBoundary, ErrorGroup } from '../utils/ErrorBoundary'
import { useRecipe } from '../hooks'
import { IUIPlugin } from '../types'
import { Loading } from './Loading'

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
`

type IEntityView = IUIPlugin & {
  recipeName?: string
  dimensions?: string
}

export const EntityView = (props: IEntityView): JSX.Element => {
  const { idReference, type, onSubmit, onOpen, recipeName, dimensions } = props
  if (!type)
    throw new Error(`<EntityView> must be called with a type. Got "${type}"`)
  const { recipe, isLoading, error, getUiPlugin } = useRecipe(
    type,
    recipeName,
    dimensions
  )

  if (isLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <Loading />
      </div>
    )

  if (error)
    return (
      <ErrorGroup>
        <p>{`Failed to find UiRecipe for type "${
          type || '(unknown type)'
        }"`}</p>
        <p>{JSON.stringify(error)}</p>
      </ErrorGroup>
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
          //the ui plugin here will render AttributeSelectorPlugin again. the problem is that when we have nested things with the same type,
          //we have no guarantee that recipe.config is correct ofr "sub attributets". It is the scope attribute in the recipe.config that creates trouble.
          //one way to fix it is to NOT ALLOW scope to be optional attribute OR handle it such taht if scope is optional attribute, try to render it if the attribute exists on document and if not exist let recipe.config be empty.

          // bug: when opening an attribute from rootDocument, the recipe from the rootDocument should NOT be used since the
        />
      </ErrorBoundary>
    </Wrapper>
  )
}

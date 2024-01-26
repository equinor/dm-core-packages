import React, { Suspense, memo, useState } from 'react'

import { Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { useRecipe } from '../hooks'
import { IUIPlugin, TUiRecipe } from '../types'
import { ErrorBoundary, ErrorGroup } from '../utils/ErrorBoundary'
import { Loading } from './Loading'
import RefreshButton from './RefreshButton'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

type IEntityView = IUIPlugin & {
  recipeName?: string
  dimensions?: string
}

const MemoizedUiPlugin = memo(function UiPlugin(
  props: IUIPlugin & {
    getPlugin: (name: string) => (p: IUIPlugin) => React.ReactElement
    recipe: TUiRecipe
  }
) {
  const UiPlugin = props.getPlugin(props.recipe.plugin)
  return <UiPlugin {...props} config={props.recipe.config ?? {}} />
})

// const MemoizedUiPlugin = memo(UiPlugin)

export const EntityView = (props: IEntityView): React.ReactElement => {
  const {
    idReference,
    type,
    onSubmit,
    onOpen,
    recipeName,
    dimensions,
    showRefreshButton,
    onChange,
  } = props
  if (!type)
    throw new Error(`<EntityView> must be called with a type. Got "${type}"`)
  const { recipe, isLoading, error, getUiPlugin } = useRecipe(
    type,
    recipeName,
    dimensions
  )

  // Refresh Button stuff
  const [reloadCounter, setReloadCounter] = useState(0)
  const [hoverOver, setHoverOver] = useState({
    refreshButton: false,
    component: false,
  })
  if (isLoading)
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <Loading />
      </div>
    )
  if (error)
    return (
      <ErrorGroup>
        <Typography>{`Failed to find UiRecipe for type "${
          type || '(unknown type)'
        }"`}</Typography>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </ErrorGroup>
    )
  if (!recipe || !Object.keys(recipe).length)
    return <Wrapper>No compatible uiRecipes for entity</Wrapper>

  const refreshable = showRefreshButton ?? recipe.showRefreshButton ?? false

  return (
    <Wrapper>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary message={`Plugin "${recipe.plugin}" crashed...`}>
          {refreshable && (
            <RefreshButton
              hidden={!hoverOver.component}
              tooltip={recipe.plugin.split('/').at(-1)}
              onMouseLeave={() =>
                setHoverOver({ ...hoverOver, refreshButton: false })
              }
              onMouseEnter={() =>
                setHoverOver({ ...hoverOver, refreshButton: true })
              }
              onClick={() => setReloadCounter(reloadCounter + 1)}
            />
          )}
          <MemoizedUiPlugin
            getPlugin={getUiPlugin}
            recipe={recipe}
            idReference={idReference}
            type={type}
            onSubmit={onSubmit}
            onOpen={onOpen}
            onChange={onChange}
            key={reloadCounter}
          />
        </ErrorBoundary>
      </Suspense>
    </Wrapper>
  )
}

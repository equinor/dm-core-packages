import React, { Suspense, memo, useState } from 'react'

import { Typography } from '@equinor/eds-core-react'
import { useRecipe } from '../hooks'
import { IUIPlugin, TUiRecipe } from '../types'
import { ErrorBoundary, ErrorGroup } from '../utils/ErrorBoundary'
import { Loading } from './Loading'
import RefreshButton from './RefreshButton'

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
  const [hoverRefresh, setHoverRefresh] = useState(false)
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
    return (
      <div className='w-full h-full flex'>
        No compatible uiRecipes for entity
      </div>
    )

  const refreshable = showRefreshButton ?? recipe.showRefreshButton ?? false
  return (
    <div className='flex w-full h-full'>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary message={`Plugin "${recipe.plugin}" crashed...`}>
          <div
            style={{
              position: 'relative',
              border: hoverRefresh
                ? '1px solid #5c5c5c'
                : '1px solid transparent',
              borderRadius: hoverRefresh ? '4px' : '0',
            }}
            key={reloadCounter}
          >
            {refreshable && (
              <RefreshButton
                hidden={false}
                tooltip={recipe.plugin.split('/').at(-1)}
                onMouseLeave={() => setHoverRefresh(false)}
                onMouseEnter={() => {
                  setHoverRefresh(true)
                }}
                onClick={() => {
                  setReloadCounter(reloadCounter + 1)
                  setHoverRefresh(false)
                }}
              />
            )}
            <div style={{ opacity: hoverRefresh ? 0.6 : 1 }}>
              <MemoizedUiPlugin
                getPlugin={getUiPlugin}
                recipe={recipe}
                idReference={idReference}
                type={type}
                onSubmit={onSubmit}
                onOpen={onOpen}
                onChange={onChange}
              />
            </div>
          </div>
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}

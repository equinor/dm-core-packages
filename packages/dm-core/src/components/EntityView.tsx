import React, { useState, Suspense, memo } from 'react'

import styled from 'styled-components'
import { ErrorBoundary, ErrorGroup } from '../utils/ErrorBoundary'
import { useRecipe } from '../hooks'
import { IUIPlugin } from '../types'
import { Loading } from './Loading'
import { Typography } from '@equinor/eds-core-react'
import RefreshButton from './RefreshButton'

const Wrapper = styled.div`
  align-self: start;
  justify-content: space-evenly;
  width: 100%;
  position: relative;
`

type IEntityView = IUIPlugin & {
  recipeName?: string
  dimensions?: string
}

function UiPlugin({
  getPlugin,
  pluginName,
  idReference,
  type,
  onSubmit,
  onOpen,
  config,
}: IUIPlugin & {
  getPlugin: (name: string) => (p: IUIPlugin) => React.ReactElement
  pluginName: string
}) {
  const UiPlugin = getPlugin(pluginName)
  return (
    <UiPlugin
      idReference={idReference}
      type={type}
      onSubmit={onSubmit}
      onOpen={onOpen}
      config={config || {}}
    />
  )
}

const MemoizedUiPlugin = memo(UiPlugin)

export const EntityView = (props: IEntityView): React.ReactElement => {
  const { idReference, type, onSubmit, onOpen, recipeName, dimensions } = props
  if (!type)
    throw new Error(`<EntityView> must be called with a type. Got "${type}"`)
  const { recipe, isLoading, error, getUiPlugin } = useRecipe(
    type,
    recipeName,
    dimensions,
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

  return (
    <Wrapper>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary message={`Plugin "${recipe.plugin}" crashed...`}>
          <div
            onMouseEnter={() => setHoverOver({ ...hoverOver, component: true })}
            onMouseLeave={() =>
              setHoverOver({ refreshButton: false, component: false })
            }
            style={
              recipe.showRefreshButton && hoverOver.refreshButton
                ? {
                    outline: '1px solid rgba(220,220,220)',
                    outlineOffset: '10px',
                    borderRadius: '10px',
                  }
                : {}
            }
          >
            {recipe.showRefreshButton && (
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
              pluginName={recipe.plugin}
              idReference={idReference}
              type={type}
              onSubmit={onSubmit}
              onOpen={onOpen}
              config={recipe.config || {}}
              key={reloadCounter}
            />
          </div>
        </ErrorBoundary>
      </Suspense>
    </Wrapper>
  )
}

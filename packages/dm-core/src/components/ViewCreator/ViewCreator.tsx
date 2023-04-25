import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
  IUIPlugin,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, Loading, TAttribute, useDMSS } from '../../index'
import React, { useEffect, useState } from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget, getScopeTypeAndDimensions } from './utils'

type TViewCreator = Omit<IUIPlugin, 'type'> & {
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
  type: string
  blueprintAttribute: TAttribute
}

/**
 * A component that will create a view from a view config.
 *
 * A view config can contain a UIRecipe (InlineRecipeViewConfig) or reference an existing UIRecipe (ReferenceViewConfig).
 * Passed type is for the document the idReference points to, _not_ any scope.
 *
 * @docs Components
 *
 * @usage
 * Code example:
 * ```
 * <ViewCreator
 *    idReference={idReference}
 *    viewConfig={viewConfig} />
 * ```
 *
 * @returns React component
 * @param props
 */
export const ViewCreator = (props: TViewCreator): JSX.Element => {
  const { idReference, viewConfig, onOpen, blueprintAttribute } = props
  const dmssAPI = useDMSS()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const [targetType, setTargetType] = useState<string>()
  const [targetDimensions, setTargetDimensions] = useState<string>()

  if (!blueprintAttribute)
    throw new Error(
      "ViewCreator was called without being passed a 'blueprintAttribute'"
    )

  useEffect(() => {
    const scopeArray: string[] = viewConfig.scope
      ? viewConfig.scope.split('.')
      : []
    getScopeTypeAndDimensions(blueprintAttribute, dmssAPI, scopeArray)
      .then(([type, dimensions]) => {
        setTargetType(type)
        setTargetDimensions(dimensions)
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Loading />
  if (error) throw error
  if (!targetType || !targetDimensions === undefined)
    throw new Error('Unable to find type and dimensions for view')

  const absoluteDottedId = getTarget(idReference, viewConfig)

  if (isInlineRecipeViewConfig(viewConfig))
    return (
      <InlineRecipeView
        idReference={absoluteDottedId}
        type={targetType}
        viewConfig={viewConfig}
        onOpen={onOpen}
      />
    )

  if (isReferenceViewConfig(viewConfig))
    return (
      <EntityView
        type={targetType}
        idReference={absoluteDottedId}
        recipeName={viewConfig.recipe}
        onOpen={onOpen}
        dimensions={targetDimensions}
      />
    )
  if (isViewConfig(viewConfig))
    return (
      <EntityView
        idReference={absoluteDottedId}
        type={targetType}
        // Don't use initialUiRecipes when rendering 'self'
        noInit={idReference === absoluteDottedId}
        onOpen={onOpen}
        dimensions={targetDimensions}
      />
    )

  return <>Unknown view config type</>
}

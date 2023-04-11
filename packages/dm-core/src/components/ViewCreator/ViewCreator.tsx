import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
  IUIPlugin,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, Loading, TGenericObject, useDocument } from '../../index'
import React from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget, getType } from './utils'

type TViewCreator = IUIPlugin & {
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
}

const getScopeDepth = (scope: string): number => {
  if (scope) {
    if (scope === 'self') {
      return 1
    }
    return scope.split('.').length
  }
  return 1
}

/**
 * A component that will create a view from a view config.
 *
 * A view config can contain a UIRecipe (InlineRecipeViewConfig) or reference an existing UIRecipe (ReferenceViewConfig).
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
  const { idReference, viewConfig, type: passedType } = props
  const [document, isLoadingDocument, _, error] = useDocument<TGenericObject>(
    idReference,
    getScopeDepth(viewConfig?.scope)
  )

  if (isLoadingDocument) return <Loading />
  if (error) throw new Error(JSON.stringify(error, null, 2))

  if (document == null) return <>Could not find the document, check the scope</>
  const type = getType(document, viewConfig) || passedType
  if (type === undefined)
    throw new Error(
      `Could not find the type, check that the scope('${viewConfig?.scope}') exists in the target document`
    )
  const absoluteDottedId = getTarget(idReference, viewConfig)

  if (isInlineRecipeViewConfig(viewConfig))
    return (
      <InlineRecipeView
        absoluteDottedId={absoluteDottedId}
        type={type}
        viewConfig={viewConfig}
      />
    )

  if (isReferenceViewConfig(viewConfig))
    return (
      <EntityView
        type={type}
        idReference={absoluteDottedId}
        recipeName={viewConfig.recipe}
      />
    )
  if (isViewConfig(viewConfig))
    return (
      <EntityView
        idReference={absoluteDottedId}
        type={type}
        // Don't use initialUiRecipes when rendering 'self'
        noInit={idReference === absoluteDottedId}
      />
    )

  return <>Unknown view config type</>
}

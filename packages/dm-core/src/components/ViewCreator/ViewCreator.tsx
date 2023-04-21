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
import { ErrorGroup } from '../../utils/ErrorBoundary'

type TViewCreator = Omit<IUIPlugin, 'type'> & {
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
  type?: string
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
  const { idReference, viewConfig, type: passedType, onOpen } = props
  const [document, isLoadingDocument, _, error] = useDocument<TGenericObject>(
    idReference,
    getScopeDepth(viewConfig?.scope ?? '')
  )

  if (isLoadingDocument) return <Loading />
  if (error) throw new Error(JSON.stringify(error, null, 2))

  if (document == null) return <>Could not find the document, check the scope</>

  const type = getType(document, viewConfig) || passedType
  if (type === undefined) {
    // If no type is passed, and the entity pointed to in "scope" is empty, we have no way of knowing type.
    //TODO: Fix this to get type from parent or something...
    return (
      <ErrorGroup>
        <pre style={{ color: 'red' }}>
          Not supported: Rendering views for empty documents are not yet
          supported.
        </pre>
      </ErrorGroup>
    )
  }
  const absoluteDottedId = getTarget(idReference, viewConfig)

  if (isInlineRecipeViewConfig(viewConfig))
    return (
      <InlineRecipeView
        idReference={absoluteDottedId}
        type={type}
        viewConfig={viewConfig}
        onOpen={onOpen}
      />
    )

  if (isReferenceViewConfig(viewConfig))
    return (
      <EntityView
        type={type}
        idReference={absoluteDottedId}
        recipeName={viewConfig.recipe}
        onOpen={onOpen}
      />
    )
  if (isViewConfig(viewConfig))
    return (
      <EntityView
        idReference={absoluteDottedId}
        type={type}
        // Don't use initialUiRecipes when rendering 'self'
        noInit={idReference === absoluteDottedId}
        onOpen={onOpen}
      />
    )

  return <>Unknown view config type</>
}

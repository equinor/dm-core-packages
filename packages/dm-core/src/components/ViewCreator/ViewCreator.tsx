import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, Loading, useDocument, TGenericObject } from '../../index'
import React from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget, getType } from './utils'

type TViewCreator = {
  idReference: string
  document: TGenericObject
  viewConfig: TViewConfig
}

const getScopeDepth = (scope: string): number => {
  if (scope) {
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
 *    document={document}
 *    viewConfig={viewConfig} />
 * ```
 *
 * @returns React component
 * @param props
 */
export const ViewCreator = (props: TViewCreator): JSX.Element => {
  const { idReference, viewConfig } = props
  const [document, isLoadingDocument] = useDocument<TGenericObject>(
    idReference,
    getScopeDepth(viewConfig.scope)
  )

  if (isLoadingDocument) {
    return (
      <div style={{ alignSelf: 'center', padding: '50px' }}>
        <Loading />
      </div>
    )
  }

  if (document == null) return <>Could not find the document, check the scope</>
  const type = getType(document, viewConfig)
  if (type === undefined) return <>Could not find the type, check the scope</>
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

  return <>Unknown view config type</>
}

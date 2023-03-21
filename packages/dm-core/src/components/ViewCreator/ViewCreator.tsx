import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, TGenericObject } from '../../index'
import React from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget, getType } from './utils'

type TViewCreator = {
  idReference: string
  document: TGenericObject
  viewConfig: TViewConfig
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
  const { idReference, document, viewConfig } = props

  if (viewConfig === undefined) return <>Missing view config</>

  const type = getType(document, viewConfig)
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

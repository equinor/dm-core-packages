import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { TGenericObject, UiPluginContext } from '../../index'
import React, { useContext } from 'react'
import { ReferenceView } from './ReferenceView'
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
  const { loading: isContextLoading, getUiPlugin } = useContext(UiPluginContext)

  if (isContextLoading) return <>Loading...</>
  if (viewConfig === undefined) return <>Missing view config</>

  const type = getType(document, viewConfig)
  const absoluteDottedId = getTarget(idReference, viewConfig)

  if (isInlineRecipeViewConfig(viewConfig)) {
    return (
      <InlineRecipeView
        absoluteDottedId={absoluteDottedId}
        type={type}
        viewConfig={viewConfig}
        getUiPlugin={getUiPlugin}
      />
    )
  }

  if (isReferenceViewConfig(viewConfig)) {
    return (
      <ReferenceView
        absoluteDottedId={absoluteDottedId}
        type={type}
        viewConfig={viewConfig}
        getUiPlugin={getUiPlugin}
      />
    )
  }

  return <>Unknown view config type</>
}

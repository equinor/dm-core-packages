import {
  isRecipeViewConfig,
  isReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { TGenericObject, UiPluginContext } from '@development-framework/dm-core'
import React, { useContext } from 'react'
import { ReferenceView } from './ReferenceView'
import { RecipeView } from './RecipeView'
import { getTarget, getType } from './utils'

type TViewCreator = {
  idReference: string
  document: TGenericObject
  viewConfig: TViewConfig
}

/**
 * A component that will create a view from a view config.
 *
 * A view config can be a recipe (RecipeViewConfig) or reference to existing recipe (ReferenceViewConfig).
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

  if (isRecipeViewConfig(viewConfig)) {
    return (
      <RecipeView
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

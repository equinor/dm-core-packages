import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
  IUIPlugin,
  TGenericObject,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, Loading, TAttribute, useDMSS } from '../../index'
import React, { useEffect, useState } from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget } from './utils'
import { AxiosResponse } from 'axios'

type TViewCreator = Omit<IUIPlugin, 'type'> & {
  viewConfig: TViewConfig | TInlineRecipeViewConfig | TReferenceViewConfig
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
  const { idReference, viewConfig, onOpen } = props
  const dmssAPI = useDMSS()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const [attribute, setAttribute] = useState<TAttribute>()

  const reference = getTarget(idReference, viewConfig)
  console.log('reference', reference)
  console.log('prop ref', idReference)
  useEffect(() => {
    dmssAPI
      .attributeGet({
        reference: reference,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data)
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Loading />
  if (error) throw error
  if (attribute === undefined)
    throw new Error('Unable to find type and dimensions for view')

  if (isInlineRecipeViewConfig(viewConfig))
    return (
      <InlineRecipeView
        idReference={reference}
        type={attribute.attributeType}
        viewConfig={viewConfig}
        onOpen={onOpen}
      />
    )

  if (isReferenceViewConfig(viewConfig)) {
    return (
      <EntityView
        type={attribute.attributeType}
        idReference={reference}
        recipeName={viewConfig.recipe}
        onOpen={onOpen}
        dimensions={attribute.dimensions}
      />
    )
  } else if (isViewConfig(viewConfig)) {
    return (
      <EntityView
        idReference={reference}
        type={attribute.attributeType}
        onOpen={onOpen}
        dimensions={attribute.dimensions}
      />
    )
  }

  return <>Unknown view config type</>
}

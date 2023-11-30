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
import { getTarget } from './utils'
import { AxiosResponse } from 'axios'
import { Typography } from '@equinor/eds-core-react'

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
export const ViewCreator = (props: TViewCreator): React.ReactElement => {
  const { idReference, viewConfig, onOpen } = props
  const dmssAPI = useDMSS()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const [attribute, setAttribute] = useState<TAttribute>()
  const [directAddress, setDirectAddress] = useState<string>(idReference)

  const reference = getTarget(idReference, viewConfig)

  useEffect(() => {
    dmssAPI
      .attributeGet({
        address: reference,
        resolve: props.viewConfig.resolve,
      })
      .then((response: AxiosResponse) => {
        setAttribute(response.data.attribute)
        setDirectAddress(response.data.address)
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Loading />
  if (error)
    return (
      <Typography>
        Could not find attribute for document with id {reference} (
        {error.message})
      </Typography>
    )
  if (attribute === undefined)
    throw new Error('Unable to find type and dimensions for view')

  if (viewConfig === undefined)
    throw new Error(
      'Cannot create a View without a "viewConfig". Sure the attribute is properly named?'
    )

  if (isInlineRecipeViewConfig(viewConfig)) {
    return (
      <InlineRecipeView
        idReference={directAddress}
        type={attribute.attributeType}
        viewConfig={viewConfig}
        onOpen={onOpen}
      />
    )
  }

  if (isReferenceViewConfig(viewConfig)) {
    return (
      <EntityView
        type={attribute.attributeType}
        idReference={directAddress}
        recipeName={viewConfig.recipe}
        onOpen={onOpen}
        dimensions={attribute.dimensions}
      />
    )
  } else if (isViewConfig(viewConfig)) {
    return (
      <EntityView
        idReference={directAddress}
        type={attribute.attributeType}
        onOpen={onOpen}
        dimensions={attribute.dimensions}
      />
    )
  }

  return <>Unknown view config type</>
}

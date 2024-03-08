import { Typography } from '@equinor/eds-core-react'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { EntityView, Loading, TAttribute, useApplication } from '../../index'
import {
  IUIPlugin,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
} from '../../types'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget } from './utils'

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
  const { idReference, viewConfig, onOpen, onSubmit, onChange } = props
  const { dmssAPI } = useApplication()
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
  }, [reference])

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
        onSubmit={onSubmit}
        onChange={onChange}
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
        showRefreshButton={viewConfig.showRefreshButton}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  } else if (isViewConfig(viewConfig)) {
    return (
      <EntityView
        idReference={directAddress}
        type={attribute.attributeType}
        onOpen={onOpen}
        dimensions={attribute.dimensions}
        showRefreshButton={viewConfig.showRefreshButton}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  }

  return <>Unknown view config type</>
}

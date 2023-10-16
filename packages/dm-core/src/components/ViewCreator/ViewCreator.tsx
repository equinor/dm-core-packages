import {
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
  IUIPlugin,
  TAttribute,
  TInlineRecipeViewConfig,
  TReferenceViewConfig,
  TViewConfig,
} from '../../types'
import { EntityView, Loading, useDMSS } from '../../index'
import React from 'react'
import { InlineRecipeView } from './InlineRecipeView'
import { getTarget } from './utils'
import { Typography } from '@equinor/eds-core-react'
import { useQuery } from '@tanstack/react-query'

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
  const reference = getTarget(idReference, viewConfig)

  const {
    data: attribute,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['attribute', reference],
    queryFn: () =>
      dmssAPI.attributeGet({ address: reference }).then((res) => {
        return res.data as TAttribute
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    keepPreviousData: true,
  })

  if (isLoading && !attribute)
    return (
      <>
        <Loading />
      </>
    )
  if (error)
    return (
      <Typography>
        Could not find attribute for document with id {reference} (
        {(error as Error).message})
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
        idReference={reference}
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

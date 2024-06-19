import { Typography } from '@equinor/eds-core-react'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { useMemo, useState } from 'react'
import {
  EntityView,
  ErrorResponse,
  Loading,
  TAttribute,
  useApplication,
} from '../../index'
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
  const { idReference, viewConfig, onOpen, onSubmit, onChange, entity } = props
  const { dmssAPI } = useApplication()
  const [error, setError] = useState<Error>()

  const reference = useMemo(
    () => getTarget(idReference, viewConfig),
    [idReference, viewConfig]
  )
  const queryKeys = ['attributes', reference, viewConfig.resolve ?? false]

  const { isPending, data } = useQuery<{
    address: string
    attribute: TAttribute
  }>({
    staleTime: 5 * 1000,
    refetchOnMount: false,
    queryKey: queryKeys,
    queryFn: () =>
      dmssAPI
        .attributeGet({
          address: reference,
          resolve: props.viewConfig.resolve,
        })
        .then((response: any) => response.data)
        .catch((error: AxiosError<ErrorResponse>) => {
          setError(error)
          return null
        }),
  })

  if (isPending) return <Loading />
  if (error)
    return (
      <Typography>
        Could not find attribute for document with id {reference} (
        {error.message})
      </Typography>
    )
  if (!data || data.attribute === undefined) {
    throw new Error('Unable to find type and dimensions for view')
  }

  if (viewConfig === undefined)
    throw new Error(
      'Cannot create a View without a "viewConfig". Sure the attribute is properly named?'
    )
  if (entity === undefined) {
    console.log('UNDEFINED ENTITY')
    console.log(viewConfig.scope)
  }
  if (isInlineRecipeViewConfig(viewConfig)) {
    return (
      <InlineRecipeView
        idReference={data.address}
        type={data.attribute.attributeType}
        entity={entity}
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
        type={data.attribute.attributeType}
        idReference={data.address}
        entity={entity}
        recipeName={viewConfig.recipe}
        onOpen={onOpen}
        dimensions={data.attribute.dimensions}
        showRefreshButton={viewConfig.showRefreshButton}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  } else if (isViewConfig(viewConfig)) {
    return (
      <EntityView
        idReference={data.address}
        entity={entity}
        type={data.attribute.attributeType}
        onOpen={onOpen}
        dimensions={data.attribute.dimensions}
        showRefreshButton={viewConfig.showRefreshButton}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  }

  return <>Unknown view config type</>
}

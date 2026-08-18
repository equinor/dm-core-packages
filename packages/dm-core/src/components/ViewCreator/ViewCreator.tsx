import { Typography } from '@equinor/eds-core-react'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useMemo } from 'react'
import {
  EntityView,
  type ErrorResponse,
  Loading,
  type TAttribute,
  useApplication,
} from '../../index'
import {
  type IUIPlugin,
  isInlineRecipeViewConfig,
  isReferenceViewConfig,
  isViewConfig,
  type TInlineRecipeViewConfig,
  type TReferenceViewConfig,
  type TViewConfig,
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

  const reference = useMemo(
    () => getTarget(idReference, viewConfig),
    [idReference, viewConfig]
  )
  const queryKeys = ['attributes', reference, viewConfig.resolve]

  const { isPending, isError, error, data } = useQuery<{
    address: string
    attribute: TAttribute
  }>({
    staleTime: 5 * 1000,
    refetchOnMount: false,
    queryKey: queryKeys,
    queryFn: () =>
      dmssAPI
        .attributeGet({ address: reference, resolve: props.viewConfig.resolve })
        .then((response: any) => response.data),
    // no .catch swallowing here - let the query reject and land in isError
  })

  if (isPending) return <Loading />
  if (isError)
    return (
      <Typography>
        Could not find attribute for document with id {reference} (
        {(error as AxiosError<ErrorResponse>)?.message})
      </Typography>
    )
  if (data?.attribute === undefined)
    throw new Error('Unable to find type and dimensions for view')
  if (isInlineRecipeViewConfig(viewConfig)) {
    return (
      <InlineRecipeView
        idReference={data.address}
        type={data.attribute.attributeType}
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

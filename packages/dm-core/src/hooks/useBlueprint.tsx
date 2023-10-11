import { useContext } from 'react'
import { TBlueprint, TUiRecipe } from 'src/types'
import { ApplicationContext } from '../context/ApplicationContext'
import { useDMSS } from '../context/DMSSContext'
import { ErrorResponse } from '../services'
import { useQuery } from '@tanstack/react-query'

interface IUseBlueprint {
  blueprint: TBlueprint | undefined
  initialUiRecipe: TUiRecipe | undefined
  uiRecipes: TUiRecipe[]
  isLoading: boolean
  error: ErrorResponse | null
}

/**
 * Hook to fetch a Blueprint from the DMSS API
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useBlueprint } from '@data-modelling-tool/core'
 *
 * const [blueprint, isLoading, error] = useBlueprint('someType')
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error getting the blueprint</div>
 *
 * if (blueprint) {
 *   return (<p>Blueprint: {blueprint?.name} ({blueprint?.type})</p>)
 * }
 * ```
 *
 * @param typeRef - The reference to the blueprint to retrieve
 * @returns A list containing the blueprint document, a boolean representing the loading state, and an Error, if any.
 */
export const useBlueprint = (typeRef: string): IUseBlueprint => {
  const dmssApi = useDMSS()
  const { name } = useContext(ApplicationContext)
  const { isLoading, data, error } = useQuery({
    queryKey: ['blueprint', typeRef],
    queryFn: () =>
      dmssApi.blueprintGet({ typeRef, context: name }).then((res) => res.data),
  })

  return {
    blueprint: (data?.blueprint as TBlueprint) || undefined,
    initialUiRecipe: (data?.initialUiRecipe as TUiRecipe) || undefined,
    uiRecipes: (data?.uiRecipes as TUiRecipe[]) || [],
    isLoading,
    error: (error as ErrorResponse) || null,
  }
}

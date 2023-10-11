import { useContext } from 'react'
import {
  ApplicationContext,
  ErrorResponse,
  IUIPlugin,
  TUiRecipe,
  useDMSS,
  useUiPlugins,
} from '../index'
import { useQuery } from '@tanstack/react-query'

const findRecipe = (
  recipes: TUiRecipe[],
  initialUiRecipe?: TUiRecipe,
  recipeName?: string,
  dimensions: string = ''
): TUiRecipe => {
  if (dimensions) {
    initialUiRecipe = undefined
  }
  // If recipe is defined, find and return the ui recipe from available recipes.
  if (recipeName) {
    const recipesToSearch = initialUiRecipe
      ? [initialUiRecipe, ...recipes]
      : recipes
    const recipe: TUiRecipe | undefined = recipesToSearch.find(
      (recipe: any) => recipe.name == recipeName
    )
    if (recipe == undefined) {
      throw Error(`Could not find the recipe with the name: ${recipeName}`)
    }
    return recipe
  }

  // If dimensions are given, use the first recipe with a matching dimension
  if (dimensions) {
    const rightDimensionsRecipe = recipes.filter(
      (r: TUiRecipe) => r.dimensions === dimensions
    )
    if (!rightDimensionsRecipe.length)
      throw new Error(`No recipe with given dimension "${dimensions}" found`)
    return rightDimensionsRecipe[0]
  }

  // If no recipe is defined, use initial recipe, or the first from recipes list or lastly fallback.
  if (initialUiRecipe && Object.keys(initialUiRecipe).length > 0) {
    return initialUiRecipe
  }
  if (recipes.length > 0) {
    // Recipes for lists should not be used as fallback
    const noDimensionsRecipes = recipes.filter(
      (r: TUiRecipe) => !r.dimensions || r.dimensions === ''
    )
    return noDimensionsRecipes[0]
  }
  throw new Error(`No uiRecipe was found`)
}

interface IUseRecipe {
  recipe: TUiRecipe | undefined
  isLoading: boolean
  error: ErrorResponse | null
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => React.ReactElement
}

/**
 * Hook to get a recipe
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useRecipe } from '@development-framework/dm-core'
 *
 * const { recipe, isLoading, error} = useRecipe('someType', 'someRecipe')
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error getting the recipe</div>
 *
 * if (recipe) {
 *   ...
 * }
 * ```
 *
 * @param typeRef - The reference to the blueprint to retrieve a recipe for
 * @param recipeName - Name of recipe to find (optional)
 * @param dimensions - The recipes dimensions
 * @returns A list containing the blueprint document, a boolean representing the loading state, and an Error, if any.
 */
export const useRecipe = (
  typeRef: string,
  recipeName?: string,
  dimensions: string = ''
): IUseRecipe => {
  const { getUiPlugin } = useUiPlugins()

  const dmssAPI = useDMSS()
  const { name } = useContext(ApplicationContext)
  const { isLoading, data, error } = useQuery({
    queryKey: ['recipe', typeRef, recipeName, dimensions],
    queryFn: () =>
      dmssAPI.blueprintGet({ typeRef, context: name }).then((response: any) => {
        return findRecipe(
          response.data.uiRecipes,
          response.data.initialUiRecipe,
          recipeName,
          dimensions
        )
      }),
  })
  return {
    recipe: isLoading ? undefined : data,
    isLoading,
    error: error as ErrorResponse | null,
    getUiPlugin,
  }
}

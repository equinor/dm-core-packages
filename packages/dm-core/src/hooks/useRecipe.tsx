import React from 'react'
import { useBlueprint, TUiRecipe, ErrorResponse } from '../index'

const findRecipe = (
  initialUiRecipe: TUiRecipe | undefined,
  recipes: TUiRecipe[],
  recipeName?: string
): TUiRecipe => {
  // If recipe is defined, find and return the ui recipe from available recipes.
  if (recipeName) {
    const recipe: TUiRecipe | undefined = recipes.find(
      (recipe: any) => recipe.name == recipeName
    )
    if (recipe == undefined) {
      throw Error(`Could not find the recipe with the name: ${recipeName}`)
    }
    return recipe
  }
  // If not recipe is defined, use initialize recipe, or the first from recipes list or lastly fallback.
  if (initialUiRecipe && Object.keys(initialUiRecipe).length > 0) {
    return initialUiRecipe
  }
  if (recipes.length > 0) {
    return recipes[0]
  }
  return {
    type: 'CORE:UIRecipe',
    name: 'yaml',
    plugin: 'yaml',
    config: {},
  }
}

interface IUseRecipe {
  recipe: TUiRecipe | undefined
  isLoading: boolean
  error: ErrorResponse | null
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
 * @returns A list containing the blueprint document, a boolean representing the loading state, and an Error, if any.
 */
export const useRecipe = (typeRef: string, recipeName?: string): IUseRecipe => {
  const { initialUiRecipe, uiRecipes, isLoading, error } = useBlueprint(typeRef)

  return {
    recipe: isLoading
      ? undefined
      : findRecipe(initialUiRecipe, uiRecipes, recipeName),
    isLoading,
    error,
  }
}

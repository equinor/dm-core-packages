import React from 'react'
import { useBlueprint, TUiRecipe } from '../index'

const findRecipe = (
  initialUiRecipe: any,
  recipeName: string | null,
  recipes: any[]
) => {
  // If recipe is defined, find and return the ui recipe from available recipes.
  if (recipeName) {
    return recipes.find((recipe: any) => recipe.name == recipeName)
  }
  // If not recipe is defined, use initialize recipe, or the first from recipes list or lastly fallback.
  // TODO: how to check that is empty?
  if (initialUiRecipe) {
    return initialUiRecipe
  }
  if (recipes.length > 0) {
    return recipes[0]
  }
  return {
    name: 'yaml',
    plugin: 'yaml',
    config: {},
  }
}

interface IUseRecipe {
  recipe: TUiRecipe
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get a recipe
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useRecipe } from '@data-modelling-tool/core'
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
export const useRecipe = (
  typeRef: string,
  recipeName: string | null
): IUseRecipe => {
  const { initialUiRecipe, uiRecipes, isLoading, error } = useBlueprint(typeRef)

  return {
    recipe: findRecipe(initialUiRecipe, recipeName, uiRecipes),
    isLoading,
    error,
  }
}

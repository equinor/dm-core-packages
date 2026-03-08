import type { IUIPlugin, TUiRecipe } from '@development-framework/dm-core'
import type { TRecipeConfigAndPlugin } from './HeaderPlugin.types'

export function getRecipeConfigAndPlugin(
  recipeName: string,
  uiRecipes: TUiRecipe[],
  getUiPlugin: (pluginName: string) => (props: IUIPlugin) => React.ReactElement
): TRecipeConfigAndPlugin {
  const recipe = uiRecipes.find(
    (recipe: TUiRecipe) => recipe.name === recipeName
  )
  if (!recipe) throw new Error(`Failed to find recipe named '${recipeName}'`)
  return {
    component: getUiPlugin(recipe.plugin),
    config: recipe?.config ?? {},
    name: recipeName,
  }
}

export const default_raw_view_ui_recipe_config = {
  type: 'dmss://system/Plugins/dm-core-plugins/view_selector/ViewSelectorConfig',
  items: [
    {
      type: 'dmss://system/Plugins/dm-core-plugins/view_selector/ViewSelectorItem',
      label: 'Yaml',
      viewConfig: {
        type: 'dmss://system/SIMOS/InlineRecipeViewConfig',
        recipe: {
          type: 'dmss://system/SIMOS/UiRecipe',
          name: 'YAML',
          description: 'YAML representation',
          plugin: '@development-framework/dm-core-plugins/yaml',
        },
        scope: 'self',
        eds_icon: 'code',
      },
    },
    {
      type: 'dmss://system/Plugins/dm-core-plugins/view_selector/ViewSelectorItem',
      label: 'Edit',
      viewConfig: {
        type: 'dmss://system/SIMOS/InlineRecipeViewConfig',
        recipe: {
          type: 'dmss://system/SIMOS/UiRecipe',
          name: 'Edit',
          description: 'Default edit',
          plugin: '@development-framework/dm-core-plugins/form',
        },
        scope: 'self',
        eds_icon: 'edit',
      },
    },
  ],
}

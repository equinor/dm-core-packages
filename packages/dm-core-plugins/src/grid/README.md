# Grid

Plugin for viewing several UI plugins on the same page.

The layout can be specified inside a RecipleLink document.

This plugin has some blueprints, that are needed for specifying the UI recipe config:

* GridArea.json
* GridItem.json
* GridPluginConfig.json
* GridSize.json

The blueprints are available in the npm package in the
folder `node_modules/@development-framework/dm-core-plugins/blueprint/grid`

# Config

Explanation of the attributes in the `GridPluginConfig`

* size: determines the total size of the grid. You have to specify number of rows and columns you want the grid to have.
* items: a list of what you want to display in the grid. It is a list of entities of type GridItem, and for each
  GridItem you have to specify how much of the grid to occupy (in terms of rows and columns) and also a viewConfig that
  specify what UI plugin
  to display in this GridItem.

Example setup:

```json
{
  "type": "CORE:RecipeLink",
  "_blueprintPath_": "/plugins/grid/blueprints/Dashboard",
  "initialUiRecipe": {
    "name": "Dashboard",
    "type": "CORE:UiRecipe",
    "plugin": "@development-framework/dm-core-plugins/grid",
    "config": {
      "type": "PLUGINS:dm-core-plugins/grid/GridPluginConfig",
      "size": {
        "type": "PLUGINS:dm-core-plugins/grid/GridSize",
        "columns": 6,
        "rows": 6
      },
      "items": [
        {
          "type": "PLUGINS:dm-core-plugins/grid/GridItem",
          "viewConfig": {
            "type": "CORE:ReferenceViewConfig",
            "scope": "aNestedObjectWithCustomUI",
            "recipe": "aRecipeName"
          },
          "gridArea": {
            "type": "PLUGINS:dm-core-plugins/grid/GridArea",
            "rowStart": 1,
            "columnStart": 1,
            "rowEnd": 3,
            "columnEnd": 4
          }
        },
        {
          "type": "PLUGINS:dm-core-plugins/grid/GridItem",
          "viewConfig": {
            "type": "CORE:ReferenceViewConfig",
            "scope": "orders[0].product",
            "recipe": "Yaml"
          },
          "gridArea": {
            "type": "PLUGINS:dm-core-plugins/grid/GridArea",
            "rowStart": 4,
            "columnStart": 5,
            "rowEnd": 6,
            "columnEnd": 6
          }
        }
      ]
    }
  },
  "uiRecipes": [
    {
      "name": "Yaml",
      "type": "CORE:UiRecipe",
      "plugin": "@development-framework/dm-core-plugins/yaml"
    },
    {
      "name": "Edit",
      "type": "CORE:UiRecipe",
      "plugin": "@development-framework/dm-core-plugins/form"
    }
  ]
}


```




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
            "scope": "attributeA",
            "recipe": "Yaml"
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
            "scope": "AttributeB",
            "recipe": "Yaml"
          },
          "gridArea": {
            "type": "PLUGINS:dm-core-plugins/grid/GridArea",
            "rowStart": 4,
            "columnStart": 3,
            "rowEnd": 7,
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
    }
  ]
}

```

For the above example grid, the layout would look like this:

![Illustration of columns and row indexing](grid_example.png)

The start and end indices for rows and columns refers to lines in the grid. The first line has number 1 (not 0). If the
grid is 6x6, then the indices are in the range 1 to 7.



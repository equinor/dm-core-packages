

The `header` plugin is meant to be used as a web application header. Providing user information, application
information, and an application recipe selector. Below the header, another UI plugin is displayed.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

Copy it like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprints/header ./myApplicationBlueprints/`

# Config

The Header plugin can accept a config of type `HeaderPluginConfig`.
Explanation of the attributes:

* `uiRecipesList`: Can be used to specify a list of UI recipes the user can select. By default, the fist UI recipe in
  the list is displayed. If the list is empty, all UI recipes will be included. If not
  specified, defaults to empty list.
* `hideAbout`: Is a boolean value that determines if the About button in the header is activated. If not specified,
  defaults to false.
* `hideUserInfo`: Is a boolean value that determines if the User info button in the header is activated. If not
  specified, defaults to false.
* `adminRole`: The role that is considered an admin role. If the user has this role, the user will see the 'admin menu' in the header.


![headerPlugin](./headerPlugin.png)

```json
{
  "type": "CORE:RecipeLink",
  "_blueprintPath_": "/apps/ExampleApplication/ExampleApplication",
  "initialUiRecipe": {
    "name": "Header",
    "type": "CORE:UiRecipe",
    "plugin": "@development-framework/dm-core-plugins/header",
    "config": {
      "type": "PLUGINS:dm-core-plugins/header/HeaderPluginConfig",
      "hideAbout": false,
      "hideUserInfo": false,
      "uiRecipesList": ["Explorer", "Yaml"]
    }
  },
  "uiRecipes": [
    {
      "name": "Explorer",
      "type": "CORE:UiRecipe",
      "plugin": "@development-framework/dm-core-plugins/explorer"
    },
    {
      "name": "Yaml",
      "type": "CORE:UiRecipe",
      "plugin": "@development-framework/dm-core-plugins/yaml"
    }
  ]
}
```

# Data Modelling Framework - UiPlugin - Header

The `header` plugin is meant to be used as a web application header. Providing user information, application
information, and an application recipe selector. Below the header, another UI plugin is displayed.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

Copy it like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprint/header ./myApplicationBlueprints/`

# Config

The Header plugin can accept a config of type `HeaderPluginConfig` (see `blueprints/HeaderPluginConfig.json`).
Explanation of the attributes:

* `uiRecipesList`: Can be used to specify a list of UI recipes the user can select. By default, the fist UI recipe in
  the list is displayed. If the list is empty, all UI recipes will be included.
* `hideAbout`: Is a boolean value that determines if the About button in the header is activated
* `hideUserInfo`: Is a boolean value that determines if the User info button in the header is activated

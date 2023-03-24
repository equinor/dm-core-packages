# Data Modelling Framework - UiPlugin - attribute selector

The `attribute-selector` plugin allows you to browse deeply nested, complex objects in a practical manner by opening
complex children
in a new tab.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

The attribute-selector UI plugin can accept a config of type `AttributeSelectorConfig` with the following attributes:

* `items` (required): A list of AttributeSelectorItem with a ViewConfig for each attribute/recipe to display.
* `childTabsOnRender` (optional): If false the tab/sidebar will only show the home button until "onOpen()" is called on
  an attribute. Defaults to true.
* `asSidebar` (optional): Specify if attributes should be displayed in a sidebar view. The alternative is a tab view.

An `AttributeSelectorItem` has the following attributes:

* `view` (required): object of type `ViewConfig` for the plugin
* `label` (optional)

The name of eds icon to display can be specified in the view attribute. List of all EDS icons can be
  found [here](https://eds-storybook-react.azurewebsites.net/?path=/docs/icons--preview). Note: Only some icons are
  available for use in this plugin. The full list can be found in the icon.ts file, and new icons can be added here if
  needed.

Copy blueprints from the attribute-selector plugin like so:
`cp -R node_modules/@development-framework/dm-core-plugins/blueprints/attribute-selector ./myApplicationBlueprints/`

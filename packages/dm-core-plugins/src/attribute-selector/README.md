# Data Modelling Framework - UiPlugin - attribute selector

The `view_selector` plugin allows you to browse deeply nested, complex objects in a practical manner by opening
complex children
in a new tab.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

The view_selector UI plugin can accept a config of type `ViewSelectorConfig` with the following attributes:

* `items` (required): A list of ViewSelectorItem with a ViewConfig for each attribute/recipe to display.
* `childTabsOnRender` (optional): If false the tab/sidebar will only show the home button until "onOpen()" is called on
  an attribute. Defaults to true.
* `asSidebar` (optional): Specify if attributes should be displayed in a sidebar view. The alternative is a tab view.

An `ViewSelectorItem` has the following attributes:

* `view` (required): object of type `ViewConfig` for the plugin
* `label` (optional)
* `scope` (optional): can be either set to `self` or one of the attributes defined in the blueprint.
* `eds_icon` (optional): specify what icon to display in the attribute selector. The name of eds icon to display must be
  chosen from the list found [here](https://eds-storybook-react.azurewebsites.net/?path=/docs/icons--preview).

Copy blueprints from the view_selector plugin like so:
`cp -R node_modules/@development-framework/dm-core-plugins/blueprints/view_selector ./myApplicationBlueprints/`

# Data Modelling Framework - UiPlugin - TabsView

The `tabs` plugin allows you to browse deeply nested, complex objects in a practical manner by opening complex children
in a new tab.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.


The attribute-selector UI plugin can accept a config of type `AttributeSelectorConfig` with the following attributes:

* `items` (required): A list of AttributeSelectorItem with a ViewConfig for each attribute/recipe to display.
* `childTabsOnRender` (optional): If false the tab/sidebar will only show the home button until "onOpen()" is called on an attribute. Defaults to true.
* `asSidebar` (optional): Specify if attributes should be displayed in a sidebar view. The alternative is a tab view.


Copy it like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprints/tabs ./myApplicationBlueprints/`

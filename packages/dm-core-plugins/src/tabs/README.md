# Data Modelling Framework - UiPlugin - TabsView

The `tabs` plugin allows you to browse deeply nested, complex objects in a practical manner by opening complex children
in a new tab.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.


The Tabs UI plugin can accept a config of type `TabsPluginConfig` with the following attributes:

*  `visibleAttributes` (optional): Can be used to control what attributes to be selectable. If the list is empty, all attributes of the entity can be selected.



Copy it like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprints/tabs ./myApplicationBlueprints/`

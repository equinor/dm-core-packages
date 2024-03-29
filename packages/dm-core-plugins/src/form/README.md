# Form

> Generate forms based on Blueprints

## Usage

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

Copy it like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprints/form ./myApplicationBlueprints/`

Alternative is to just import it directly without copying: `dm pkg import
node_modules/@development-framework/form/dist/blueprints/ DemoDataSource``

## Fields and widgets

The form is made up from fields and widgets:

![your-UML-diagram-name](docs/components.png)

The attribute field selects correct fields for each attribute.

When displaying an entity, the Form plugin will fetch the blueprint for that entity and display all fields. However, it
is possible to control what fields to show, and in what order,
inside the Form's UI recipe config:

The `fields` attribute is a list of fields to include in the form. If no `fields` attribute is included in the config,
all fields will be shown as default. The order or attributes displayed in the Form plugin will be equal to the order of
attributes defined in the  `fields` list.


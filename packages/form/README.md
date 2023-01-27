# Form

>  Generate forms based on Blueprints

## Usage

Add the package to your project with `npm add @development-framework/form`.

If you want to specify a config object in some UiRecipe-entity, the Blueprint is included in the npm package.

Copy it like so: `cp -R node_modules/@development-framework/form/dist/blueprint ./myApplicationBlueprints/`

Alternative is to just import it directly without copying: `dm pkg import node_modules/@development-framework/form/dist/blueprints/ DemoDataSource``

## Fields and widgets 

The form is made up from fields and widgets:

![your-UML-diagram-name](docs/components.png)

The attribute field selects correct fields for each attribute.


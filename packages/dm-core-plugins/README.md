# Data Modelling Framework - Core UiPlugins

This package contains some core utility UIPlugins for the Data Modelling Framework system.

Add the package to your project with `npm add @development-framework/dm-core-plugins`.

## Plugins provided

| name        | description                                                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------|
| yaml-view   | View any entity as YAML                                                                                                               |
| blueprint   | Create and edit Blueprints                                                                                                            |
| form        | Edit any entity                                                                                                                       |
| explorer    | Provides a file-system-like tree view of DataSources and Entities                                                                     |
| header      | Provides a header to a web application. With "About", "Logged in user info", and "attributeSelector"                                  |
| tabs        | The `tabs` plugin allows you to browse deeply nested, complex objects in a practical manner by opening complex children in a new tab. |
| json-view   | View any entity as JSON                                                                                                               |                                                                                                             |
| pdf         | View PDF files                                                                                                                        |                                                                                                                        |
| job         | Create, edit, and control jobs                                                                                                        |                                                                                                        |                                                                                                                                      |
| mermaid     | Draw a flowchart diagram of blueprint relationships                                                                                   |                                                                                                                                      |

If you want to specify a config object in some UiRecipe-entity, the Blueprints is included in the npm package.  
Add them to your DM-App blueprints pacakge like so: `cp -R node_modules/@development-framework/dm-core-plugins/blueprints ./myApplicationBlueprints/`


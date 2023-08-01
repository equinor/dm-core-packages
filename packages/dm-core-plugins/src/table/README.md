# Table

A plugin for displaying a list of items in a table view.

With this plugin you can

* view a list of items
* perform operations on the list like add, delete, edit and sort
* Open list items to display their content

The blueprints are available in the npm package in the
folder `node_modules/@development-framework/dm-core-plugins/blueprint/table`

# Config

### Explanation of the attributes in `TablePluginConfig`:

* columns: define what attributes to display in the columns of the table.
* editableColumns: define what columns should be possible to edit the value of. The columns defined as editable must
  also be defined in the `columns` attribute.
* functionality: is used to define what functionality is added to the table. See the explanation
  of `TableFunctionalityConfig` below for more details.
* expandableRecipeViewConfig: define what UI recipe to show when clicking on the expand button.

### Explanation of the attributes in `TableFunctionalityConfig`

* openAsTab: determines if the list item should be opened in a new tab when clicking on expand
* openAsExpandable: determines if the list item should be opened in an accordian when clicking on expand
* Also, there are attributes to turn on different features for the user:
    * add
    * delete
    * edit
    * sort
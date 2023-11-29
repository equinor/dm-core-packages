# Table

A plugin for displaying a list of items in a table view.

With this plugin you can

- View and preview a list of items
- Perform operations on the list like add, delete, edit and sort
- Open list items to display their content
- Plot data into excel like tables

The blueprints are available in the npm package in the
folder `node_modules/@development-framework/dm-core-plugins/blueprint/table`

# Config

## Explanation of the attributes in `TablePluginConfig`:

### variant: array of objects

NOTE: The order in which you pass variants is the order in which they will appear. ["view", "edit"] will showcase a view table switchable to edit. ["edit", "view"] will showcase a edit table switchable to view. You can also only pass one variant.

- `name: "view" | "edit"`

  - required
  - Define which table variant you're configuring

- `density: "compact" | "comfortable"`

  - optional, default: "compact"
  - Two vaiants of padding are available.

- `functionality: object`
  - fields: `delete: boolean, add: boolean`
  - optional, `default: delete: true, add: true`
  - Define which functionality you want available for the variant you're configuring

### columns: array of objects

NOTE: The order in which you pass columns is the order they will appear in.

- `data: string`

  - required
  - Define what attributes to display in the columns of the table. (Extract from data object)

- `label: string`

  - optional, default: name of data attribute
  - Allows you to pass a label that will appear in the header column instead of attribute name.

- `dataType: "string" | "boolean" | "number"`

  - optional, default: string
  - Define what data type is to expand functionality and handle data properly

- `presentAs: "checkbox" | "text"`

  - optional, default: checkbox
  - When dataType is set to boolean, you can choose to present the data as either a checkbox or as text

- `editable: boolean`

  - optional, default: true
  - when using edit variant of table, should rows be editable in specific column

- `sortable: boolean`
  - optional, default: true
  - In view variant: should user be able to sort items in ascending or descending order. Fitting for values that make sense to order alphabetically or by size (numbers)

#### Special Columns

You can also add special columns that have built-in functionality wherever you want in the columns array. These have pre-defined values and only require you to fill out the name in the data field.

- "data": "^tab"
  - Prints button for user to open table item (entity) in new tab
- "data": "^expandable"
  - Makes the table row an accordion and prints button to allow user to toggle show/hide. Uses default recipe if expandableRecipeViewConfig is not defined. This field is more appropriate to use either as first or last column.

### expandableRecipeViewConfig:

Define what UI recipe to show when clicking on the expand button.

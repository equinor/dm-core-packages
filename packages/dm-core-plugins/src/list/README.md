# List

A plugin for displaying a list of complex objects.

With this plugin you can

* Add new items to the list
* Remove items from the list
* Change the order of items in the list.
* Open item to view their content.

The blueprints are available in the npm package in the
folder `node_modules/@development-framework/dm-core-plugins/blueprint/list`

# Config

Explanation of the attributes in the `ListPluginConfig`

NB! as of August 2023 the functionality of the list plugin is rapidly changing and the docs here are outdated.
TODO update this documentation.

* expanded(boolean): items in the list is expanded by default
* headers(list(string)): a list of which attributes to display as headers in the list view
* canOpen(boolean): will open the item in a new tab when clicking the expand button
* functionality: is used for specifying which functionality that should be available in the UI plugin. The possible
  options are
    * delete
    * add
    * edit (not implemented)
    * sort
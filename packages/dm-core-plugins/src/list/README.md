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

* expanded: is used to specify if items in the list should be expanded initially.
* headers: a list of which attributes to display has headers in the list view.
* functionality: is used for specifying which functionality that should be available in the UI plugin. The possible
  options are
    * OpenAsTab (will open the item in a new tab when clicking the expand button)
    * openAsExandable (will open the item in a accordian when clicking the expand button)
    * delete
    * add
    * edit
    * sort